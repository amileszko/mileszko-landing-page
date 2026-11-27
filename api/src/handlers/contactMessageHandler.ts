import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { DynamoDBDocument, PutCommand } from "@aws-sdk/lib-dynamodb";
import {
  getMultipartBoundary,
  MaxFileSizeExceededError,
  MultipartParseError,
  parseMultipart,
} from "@mjackson/multipart-parser";
import { randomUUID } from "node:crypto";

import {
  CONTACT_RETENTION_SECONDS,
  MAX_ATTACHMENT_SIZE,
  MAX_ATTACHMENT_SIZE_MB,
  MAX_ATTACHMENTS,
} from "../constants/contact";
import {
  type ContactMessagePayload,
  ContactMessageRequestSchema,
  type ContactMessageResponse,
} from "../definitions/contactMessage";
import {
  AttachmentValidationError,
  validateAttachment,
} from "../utils/fileValidation";

const region =
  process.env.AWS_REGION ??
  (() => {
    throw new Error("AWS_REGION is not set");
  })();
const dynamoDbTableName =
  process.env.DYNAMODB_TABLE_NAME ??
  (() => {
    throw new Error("DYNAMODB_TABLE_NAME is not set");
  })();
const snsTopicArn =
  process.env.SNS_TOPIC_ARN ??
  (() => {
    throw new Error("SNS_TOPIC_ARN is not set");
  })();
const s3BucketName =
  process.env.S3_BUCKET_NAME ??
  (() => {
    throw new Error("S3_BUCKET_NAME is not set");
  })();

const ddbClient = new DynamoDBClient({ region });
const ddbDocClient = DynamoDBDocument.from(ddbClient);
const snsClient = new SNSClient({ region });
const s3Client = new S3Client({ region });

const uploadAttachmentToS3 = async (
  file: File,
  messageId: string,
): Promise<string> => {
  const attachmentId = randomUUID();
  const {
    buffer,
    contentType,
    filename,
  } = await validateAttachment(file);
  const key = `attachments/${messageId}/${attachmentId}-${filename}`;

  const putObjectParams = {
    Body: buffer,
    Bucket: s3BucketName,
    ContentType: contentType,
    Key: key,
    Metadata: {
      attachmentId,
      messageId,
      originalName: filename,
    },
  };

  await s3Client.send(new PutObjectCommand(putObjectParams));

  return key;
};

interface ContactMessageMultipartRequest {
  body: string
  contentType: string
}

class InternalError extends Error {
  constructor(message = "Internal error") {
    super(message);
  }
}

class ValidationError extends Error {
  constructor(message = "Invalid input data") {
    super(message);
  }
}

const handler = async (event: ContactMessageMultipartRequest):
  Promise<ContactMessageResponse> => {
  try {
    const boundary = getMultipartBoundary(event.contentType);

    if (!boundary) {
      throw new ValidationError("Invalid input data: Missing boundary.");
    }

    const fields: Record<string, string> = {};
    const files: File[] = [];

    try {
      for (const part of parseMultipart(
        Buffer.from(
          event.body,
          "base64",
        ),
        {
          boundary,
          maxFileSize: MAX_ATTACHMENT_SIZE,
        },
      )) {
        if (part.isFile && part.filename) {
          if (files.length >= MAX_ATTACHMENTS) {
            throw new ValidationError(
              `Invalid input data: Maximum ${MAX_ATTACHMENTS} files allowed.`,
            );
          }

          files.push(new File(
            [part.arrayBuffer],
            part.filename,
          ));
        }
        else if (part.name) {
          fields[part.name] = part.text;
        }
      }
    }
    catch (error) {
      if (error instanceof MaxFileSizeExceededError) {
        throw new ValidationError(
          `Invalid input data: Attachment exceeds ${MAX_ATTACHMENT_SIZE_MB} MB.`,
        );
      }

      if (error instanceof MultipartParseError) {
        throw new ValidationError("Invalid input data: Malformed multipart request.");
      }

      throw error;
    }

    const request = {
      attachments: files,
      cooperation: fields.cooperation,
      description: fields.description,
      email: fields.email,
      nda: fields.nda,
      topic: fields.topic,
    };

    const parseResult = ContactMessageRequestSchema.safeParse(request);

    if (!parseResult.success) {
      throw new ValidationError(
        `Invalid input data: ${JSON.stringify(parseResult.error.issues)}`,
      );
    }

    const {
      attachments,
      cooperation,
      description,
      email,
      nda,
      topic,
    } = parseResult.data;

    const now = new Date()
      .toISOString();
    const messageId = randomUUID();

    let attachmentsKeys: string[] = [];

    if (attachments.length > 0) {
      try {
        attachmentsKeys = await Promise.all(
          attachments.map(file => uploadAttachmentToS3(
            file,
            messageId,
          )),
        );
      }
      catch (error) {
        if (error instanceof AttachmentValidationError) {
          throw new ValidationError(`Invalid input data: ${error.message}`);
        }

        throw error;
      }
    }

    const messageItem = {
      AttachmentsKeys: attachmentsKeys,
      Cooperation: cooperation,
      CreatedAt: now,
      Description: description,
      Email: email,
      ExpiresAt: Math.floor(Date.now() / 1000) + CONTACT_RETENTION_SECONDS,
      Id: messageId,
      Nda: nda,
      Topic: topic,
      UpdatedAt: now,
    };

    const putCommandParams = {
      Item: messageItem,
      TableName: dynamoDbTableName,
    };

    await ddbDocClient.send(new PutCommand(putCommandParams));

    const snsMessage: ContactMessagePayload = {
      attachmentsKeys,
      cooperation,
      description,
      email,
      messageId,
      nda,
      topic,
    };

    const snsMessageParams = {
      Message: JSON.stringify(snsMessage),
      TopicArn: snsTopicArn,
    };

    await snsClient.send(new PublishCommand(snsMessageParams));

    return { messageDelivered: true };
  }
  catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    console.error(
      "Contact message processing failed:",
      error instanceof Error ? error.name : "Unknown error",
    );

    throw new InternalError();
  }
};

export { handler };
