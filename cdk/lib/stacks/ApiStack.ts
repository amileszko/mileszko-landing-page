import { Stack, type StackProps } from "aws-cdk-lib";
import { type IHostedZone } from "aws-cdk-lib/aws-route53";
import { type Construct } from "constructs";

import { createContactAlarms } from "../constructs/contactAlarms";
import { createContactApi } from "../constructs/contactApi";
import { createContactFunctions } from "../constructs/contactFunctions";
import { createContactMessaging } from "../constructs/contactMessaging";
import { createContactStorage } from "../constructs/contactStorage";

interface ApiStackProps extends StackProps {
  apiDomainName: string
  contactEmail: string
  contactName: string
  hostedZone: IHostedZone
  notificationRecipientEmail: string
  notificationSenderEmail: string
  notificationSenderName: string
  websiteDomainName: string
}

export class ApiStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: ApiStackProps,
  ) {
    super(
      scope,
      id,
      {
        ...props,
        terminationProtection: true,
      },
    );

    const storage = createContactStorage(this);
    const messaging = createContactMessaging(
      this,
      { notificationRecipientEmail: props.notificationRecipientEmail },
    );
    const functions = createContactFunctions(
      this,
      {
        contactAsyncDlq: messaging.contactAsyncDlq,
        contactEmail: props.contactEmail,
        contactEmailConfigurationSet: messaging.contactEmailConfigurationSet,
        contactMessagesAttachmentsBucket:
          storage.contactMessagesAttachmentsBucket,
        contactMessagesTable: storage.contactMessagesTable,
        contactMessagesTopic: messaging.contactMessagesTopic,
        contactName: props.contactName,
        notificationRecipientEmail: props.notificationRecipientEmail,
        notificationSenderEmail: props.notificationSenderEmail,
        notificationSenderName: props.notificationSenderName,
        websiteDomainName: props.websiteDomainName,
      },
    );
    const api = createContactApi(
      this,
      {
        apiDomainName: props.apiDomainName,
        contactMessageHandler: functions.contactMessageHandler,
        dockerImage: functions.dockerImage,
        hostedZone: props.hostedZone,
        websiteDomainName: props.websiteDomainName,
      },
    );

    createContactAlarms(
      this,
      {
        alarmTopic: messaging.alarmTopic,
        api,
        contactAsyncDlq: messaging.contactAsyncDlq,
        contactEmailConfigurationSet: messaging.contactEmailConfigurationSet,
        contactMessageDeliveredEmailHandler:
          functions.contactMessageDeliveredEmailHandler,
        contactMessageHandler: functions.contactMessageHandler,
        contactMessageNotificationEmailHandler:
          functions.contactMessageNotificationEmailHandler,
        contactMessagesTopic: messaging.contactMessagesTopic,
      },
    );
  }
}
