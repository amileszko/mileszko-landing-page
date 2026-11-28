import { render } from "@react-email/render";
import fs from "node:fs";
import path from "node:path";
import { type ReactElement } from "react";

import {
  ContactMessageDeliveredEmail,
} from "./messages/ContactMessageDeliveredEmail";
import {
  ContactMessageNotificationEmail,
} from "./messages/ContactMessageNotificationEmail";

interface EmailBuild {
  component: ReactElement
  directory: string
  name: string
  title: string
}

const emails: EmailBuild[] = [
  {
    component: <ContactMessageDeliveredEmail />,
    directory: "dist/contactMessageDeliveredEmailHandler/templates",
    name: "contact-message-delivered",
    title: "🚦 Szybka analiza i jasny plan w 24h — dziękuję za kontakt",
  },
  {
    component: <ContactMessageNotificationEmail />,
    directory: "dist/contactMessageNotificationEmailHandler/templates",
    name: "contact-message-notification",
    title: "🚨 Nowa wiadomość z formularza — sprawdź szczegóły",
  },
];

const plainTextOptions = {
  selectors: [
    { options: { uppercase: false }, selector: "h1" },
    { options: { uppercase: false }, selector: "h2" },
    { options: { uppercase: false }, selector: "h3" },
    { options: { uppercase: false }, selector: "h4" },
    {
      options: {
        hideLinkHrefIfSameAsText: true,
        leadingLineBreaks: 1,
        linkBrackets: false,
        trailingLineBreaks: 1,
      },
      selector: "a",
    },
  ],
};

const buildEmail = async ({
  component,
  directory,
  name,
  title,
}: EmailBuild) => {
  const html = await render(
    component,
    { pretty: true },
  );
  const text = await render(
    component,
    {
      htmlToTextOptions: plainTextOptions,
      plainText: true,
    },
  );

  await fs.promises.mkdir(
    directory,
    { recursive: true },
  );
  await Promise.all([
    fs.promises.writeFile(
      path.join(
        directory,
        `${name}.html`,
      ),
      html,
    ),
    fs.promises.writeFile(
      path.join(
        directory,
        `${name}.txt`,
      ),
      `${title}\n\n${text}`,
    ),
  ]);
};

await Promise.all(emails.map(email => buildEmail(email)));

console.log(`Built ${emails.length} email templates.`);
