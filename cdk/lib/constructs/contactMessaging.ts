import { Duration, RemovalPolicy } from "aws-cdk-lib";
import { Effect, PolicyStatement, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Key } from "aws-cdk-lib/aws-kms";
import {
  ConfigurationSet,
  ConfigurationSetEventDestination,
  ConfigurationSetTlsPolicy,
  EmailSendingEvent,
  EventDestination,
} from "aws-cdk-lib/aws-ses";
import { Topic } from "aws-cdk-lib/aws-sns";
import { EmailSubscription } from "aws-cdk-lib/aws-sns-subscriptions";
import { Queue, QueueEncryption } from "aws-cdk-lib/aws-sqs";
import { type Construct } from "constructs";

const createContactMessaging = (
  scope: Construct,
  props: {
    notificationRecipientEmail: string
  },
) => {
  const snsKey = new Key(
    scope,
    "SnsKey",
    {
      alias: "mileszko-contact-sns",
      enableKeyRotation: true,
      removalPolicy: RemovalPolicy.RETAIN,
    },
  );

  snsKey.addToResourcePolicy(new PolicyStatement({
    actions: [
      "kms:Decrypt",
      "kms:GenerateDataKey*",
    ],
    effect: Effect.ALLOW,
    principals: [new ServicePrincipal("ses.amazonaws.com")],
    resources: ["*"],
  }));

  const contactMessagesTopic = new Topic(
    scope,
    "ContactMessagesTopic",
    { masterKey: snsKey },
  );

  const emailFeedbackTopic = new Topic(
    scope,
    "EmailFeedbackTopic",
    { masterKey: snsKey },
  );

  const contactEmailConfigurationSet = new ConfigurationSet(
    scope,
    "ContactEmailConfigurationSet",
    {
      reputationMetrics: true,
      sendingEnabled: true,
      tlsPolicy: ConfigurationSetTlsPolicy.REQUIRE,
    },
  );

  new ConfigurationSetEventDestination(
    scope,
    "ContactEmailFeedbackDestination",
    {
      configurationSet: contactEmailConfigurationSet,
      destination: EventDestination.snsTopic(emailFeedbackTopic),
      events: [
        EmailSendingEvent.BOUNCE,
        EmailSendingEvent.COMPLAINT,
        EmailSendingEvent.DELIVERY,
        EmailSendingEvent.REJECT,
      ],
    },
  );

  emailFeedbackTopic.addSubscription(
    new EmailSubscription(props.notificationRecipientEmail),
  );

  const alarmTopic = new Topic(
    scope,
    "AlarmTopic",
    {
      displayName: "Contact API alarms",
      masterKey: snsKey,
    },
  );

  alarmTopic.addSubscription(
    new EmailSubscription(props.notificationRecipientEmail),
  );

  const contactAsyncDlq = new Queue(
    scope,
    "ContactAsyncDlq",
    {
      encryption: QueueEncryption.SQS_MANAGED,
      enforceSSL: true,
      retentionPeriod: Duration.days(14),
    },
  );

  return {
    alarmTopic,
    contactAsyncDlq,
    contactEmailConfigurationSet,
    contactMessagesTopic,
    emailFeedbackTopic,
    snsKey,
  };
};

export { createContactMessaging };
