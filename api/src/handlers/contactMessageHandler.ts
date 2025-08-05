import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { DynamoDBDocument, PutCommand } from "@aws-sdk/lib-dynamodb";
import {
  getMultipartBoundary,
  parseMultipart,
} from "@mjackson/multipart-parser";
import { randomUUID } from "node:crypto";

import {
  type ContactMessagePayload,
  ContactMessageRequestSchema,
  type ContactMessageResponse,
} from "../definitions/contactMessage";

const region =
  process.env.AWS_REGION ??
  (() => {
    throw new Error("AWS_REGION is not set");
  })();
const accessKeyId =
  process.env.AWS_ACCESS_KEY_ID ??
  (() => {
    throw new Error("AWS_ACCESS_KEY_ID is not set");
  })();
const secretAccessKey =
  process.env.AWS_SECRET_ACCESS_KEY ??
  (() => {
    throw new Error("AWS_SECRET_ACCESS_KEY is not set");
  })();
const sessionToken =
  process.env.AWS_SESSION_TOKEN ??
  (() => {
    throw new Error("AWS_SESSION_TOKEN is not set");
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

const ddbClient = new DynamoDBClient({
  credentials: {
    accessKeyId,
    secretAccessKey,
    sessionToken,
  },
  region,
});
const ddbDocClient = DynamoDBDocument.from(ddbClient);
const snsClient = new SNSClient({
  credentials: {
    accessKeyId,
    secretAccessKey,
    sessionToken,
  },
  region,
});
const s3Client = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey,
    sessionToken,
  },
  region,
});

const uploadAttachmentToS3 = async (
  file: File,
  messageId: string,
): Promise<string> => {
  const attachmentId = randomUUID();
  const key = `attachments/${messageId}/${attachmentId}-${file.name}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const putObjectParams = {
    Body: buffer,
    Bucket: s3BucketName,
    ContentType: file.type,
    Key: key,
    Metadata: {
      attachmentId,
      messageId,
      originalName: file.name,
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

    for (const part of parseMultipart(
      Buffer.from(
        event.body,
        "base64",
      ),
      { boundary },
    )) {
      if (part.isFile && part.filename) {
        if (files.length >= 4) {
          throw new ValidationError("Invalid input data: Maximum 4 files allowed.");
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

    const attachmentsKeys = attachments.length > 0 ?
      await Promise.all(attachments.map(file => uploadAttachmentToS3(
        file,
        messageId,
      ))) :
      [];

    const messageItem = {
      AttachmentsKeys: attachmentsKeys,
      Cooperation: cooperation,
      CreatedAt: now,
      Description: description,
      Email: email,
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
    else {
      const errorMessage = error instanceof Error ?
        error.message :
        "Unknown error";

      throw new InternalError(`Internal error: ${errorMessage}`);
    }
  }
};

export { handler };
