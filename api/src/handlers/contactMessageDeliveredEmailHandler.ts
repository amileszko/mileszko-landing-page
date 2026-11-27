import {
  SendEmailCommand,
  type SendEmailRequest,
  SESv2Client,
} from "@aws-sdk/client-sesv2";
import { type SNSEvent, type SNSHandler } from "aws-lambda";
import fs from "node:fs";
import path from "node:path";

import { type ContactMessagePayload } from "../definitions/contactMessage";
import { emailTemplatesService } from "../utils/emailTemplatesService";

const region =
  process.env.AWS_REGION ??
  (() => {
    throw new Error("AWS_REGION is not set");
  })();
const sesConfigurationSetName =
  process.env.SES_CONFIGURATION_SET_NAME ??
  (() => {
    throw new Error("SES_CONFIGURATION_SET_NAME is not set");
  })();
const sesSenderEmail =
  process.env.SES_SENDER_EMAIL ??
  (() => {
    throw new Error("SES_SENDER_EMAIL is not set");
  })();

const sesClient = new SESv2Client({ region });

const templatesDir = path.join(
  __dirname,
  "templates",
);

const contactMessageDeliveredHtmlTemplate = fs.readFileSync(
  path.join(
    templatesDir,
    "contact-message-delivered.html",
  ),
  "utf8",
);

const contactMessageDeliveredTextTemplate = fs.readFileSync(
  path.join(
    templatesDir,
    "contact-message-delivered.txt",
  ),
  "utf8",
);

export const handler: SNSHandler = async (event: SNSEvent): Promise<void> => {
  for (const record of event.Records) {
    const message = JSON.parse(record.Sns.Message) as ContactMessagePayload;

    const emailSubject = emailTemplatesService
      .getSubjectFromTemplate(contactMessageDeliveredHtmlTemplate);

    const emailParams: SendEmailRequest = {
      ConfigurationSetName: sesConfigurationSetName,
      Content: {
        Simple: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: contactMessageDeliveredHtmlTemplate,
            },
            Text: {
              Charset: "UTF-8",
              Data: contactMessageDeliveredTextTemplate,
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: emailSubject,
          },
        },
      },
      Destination: { ToAddresses: [message.email] },
      FromEmailAddress: sesSenderEmail,
    };

    await sesClient.send(new SendEmailCommand(emailParams));
  }
};
