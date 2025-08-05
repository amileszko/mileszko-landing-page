import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
  SendEmailCommand,
  type SendEmailRequest,
  SESv2Client,
} from "@aws-sdk/client-sesv2";
import { type SNSEvent, type SNSHandler } from "aws-lambda";
import libmime from "libmime";
import fs from "node:fs";
import path from "node:path";

import { type ContactMessagePayload } from "../definitions/contactMessage";
import { emailTemplatesService } from "../utils/emailTemplatesService";

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
const sesSenderEmail =
  process.env.SES_SENDER_EMAIL ??
  (() => {
    throw new Error("SES_SENDER_EMAIL is not set");
  })();
const sesRecipientEmail =
  process.env.SES_RECIPIENT_EMAIL ??
  (() => {
    throw new Error("SES_RECIPIENT_EMAIL is not set");
  })();
const s3BucketName =
  process.env.S3_BUCKET_NAME ??
  (() => {
    throw new Error("S3_BUCKET_NAME is not set");
  })();

const sesClient = new SESv2Client({
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

const templatesDir = path.join(
  __dirname,
  "templates",
);

const contactMessageNotificationHtmlTemplate = fs.readFileSync(
  path.join(
    templatesDir,
    "contact-message-notification.html",
  ),
  "utf-8",
);

const contactMessageNotificationTextTemplate = fs.readFileSync(
  path.join(
    templatesDir,
    "contact-message-notification.txt",
  ),
  "utf-8",
);

interface AttachmentData {
  content: Buffer
  contentType: string
  filename: string
}

const getAttachmentFromS3 = async (
  s3Key: string,
): Promise<AttachmentData | undefined> => {
  try {
    const getCommand = new GetObjectCommand({
      Bucket: s3BucketName,
      Key: s3Key,
    });

    const result = await s3Client.send(getCommand);

    if (!result.Body) {
      return undefined;
    }

    const filename = libmime.decodeWords(result.Metadata?.originalname ?? "unknown");
    const content = Buffer.from(await result.Body.transformToByteArray());

    return {
      content,
      contentType: result.ContentType ?? "application/octet-stream",
      filename,
    };
  }
  catch (error) {
    console.error(
      `Failed to retrieve attachment ${s3Key}:`,
      error,
    );
    return undefined;
  }
};

export const handler: SNSHandler = async (event: SNSEvent): Promise<void> => {
  for (const record of event.Records) {
    const message = JSON.parse(record.Sns.Message) as ContactMessagePayload;

    const emailSubject = emailTemplatesService
      .getSubjectFromTemplate(contactMessageNotificationHtmlTemplate);

    const attachments: AttachmentData[] = message.attachmentsKeys.length > 0 ?
      (await Promise.all(
        message.attachmentsKeys.map(key => getAttachmentFromS3(key)),
      )).filter(attachment => attachment !== undefined) :
      [];

    const attachmentText = attachments.length > 0 ?
      `Załączniki: ${attachments.map(attachment => attachment.filename)
        .join(", ")}` :
      "Brak załączników";

    const emailHtmlBody = emailTemplatesService.replaceTemplateVariables(
      contactMessageNotificationHtmlTemplate,
      {
        attachments: attachmentText,
        cooperation: message.cooperation,
        description: message.description,
        email: message.email,
        nda: !message.nda || message.nda.length === 0 ? "Brak danych" : message.nda,
        topic: message.topic,
      },
    );

    const emailTextBody = emailTemplatesService.replaceTemplateVariables(
      contactMessageNotificationTextTemplate,
      {
        attachments: attachmentText,
        cooperation: message.cooperation,
        description: message.description,
        email: message.email,
        nda: !message.nda || message.nda.length === 0 ? "Brak danych" : message.nda,
        topic: message.topic,
      },
    );

    const sesAttachments = attachments.map(attachment => ({
      ContentDisposition: "ATTACHMENT" as const,
      ContentTransferEncoding: "BASE64" as const,
      ContentType: attachment.contentType,
      FileName: attachment.filename,
      RawContent: new Uint8Array(attachment.content),
    }));

    const emailParams: SendEmailRequest = {
      Content: {
        Simple: {
          Attachments: sesAttachments,
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: emailHtmlBody,
            },
            Text: {
              Charset: "UTF-8",
              Data: emailTextBody,
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: emailSubject,
          },
        },
      },
      Destination: { ToAddresses: [sesRecipientEmail] },
      FromEmailAddress: sesSenderEmail,
    };

    await sesClient.send(new SendEmailCommand(emailParams));
  }
};
