import { DockerImage, Duration, Stack } from "aws-cdk-lib";
import { type Table } from "aws-cdk-lib/aws-dynamodb";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import {
  Architecture,
  AssetCode,
  EventInvokeConfig,
  Function,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { SqsDestination } from "aws-cdk-lib/aws-lambda-destinations";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { type Bucket } from "aws-cdk-lib/aws-s3";
import { type ConfigurationSet } from "aws-cdk-lib/aws-ses";
import { type Topic } from "aws-cdk-lib/aws-sns";
import { LambdaSubscription } from "aws-cdk-lib/aws-sns-subscriptions";
import { type Queue } from "aws-cdk-lib/aws-sqs";
import { type Construct } from "constructs";

import { CONTACT_API_RESERVED_CONCURRENCY } from "../constants/security";

const createContactFunctions = (
  scope: Construct,
  props: {
    contactAsyncDlq: Queue
    contactEmail: string
    contactEmailConfigurationSet: ConfigurationSet
    contactMessagesAttachmentsBucket: Bucket
    contactMessagesTable: Table
    contactMessagesTopic: Topic
    contactName: string
    notificationRecipientEmail: string
    notificationSenderEmail: string
    notificationSenderName: string
    websiteDomainName: string
  },
) => {
  const contactMessageLogGroup = new LogGroup(
    scope,
    "ContactMessageLogGroup",
    { retention: RetentionDays.THREE_MONTHS },
  );
  const contactMessageDeliveredEmailLogGroup = new LogGroup(
    scope,
    "ContactMessageDeliveredEmailLogGroup",
    { retention: RetentionDays.THREE_MONTHS },
  );
  const contactMessageNotificationEmailLogGroup = new LogGroup(
    scope,
    "ContactMessageNotificationEmailLogGroup",
    { retention: RetentionDays.THREE_MONTHS },
  );

  const dockerImage = DockerImage.fromBuild(
    "../",
    { file: "api/Dockerfile" },
  );

  const contactMessageHandler = new Function(
    scope,
    "ContactMessageHandler",
    {
      architecture: Architecture.ARM_64,
      code: new AssetCode(dockerImage.cp("/output/contactMessageHandler/.")),
      environment: {
        DYNAMODB_TABLE_NAME: props.contactMessagesTable.tableName,
        S3_BUCKET_NAME: props.contactMessagesAttachmentsBucket.bucketName,
        SNS_TOPIC_ARN: props.contactMessagesTopic.topicArn,
      },
      handler: "index.handler",
      logGroup: contactMessageLogGroup,
      reservedConcurrentExecutions: CONTACT_API_RESERVED_CONCURRENCY,
      runtime: Runtime.NODEJS_26_X,
      timeout: Duration.seconds(30),
    },
  );

  const contactMessageDeliveredEmailHandler = new Function(
    scope,
    "ContactMessageDeliveredEmailHandler",
    {
      architecture: Architecture.ARM_64,
      code: new AssetCode(dockerImage.cp("/output/contactMessageDeliveredEmailHandler/.")),
      environment: {
        SES_CONFIGURATION_SET_NAME:
          props.contactEmailConfigurationSet.configurationSetName,
        SES_SENDER_EMAIL: `"${props.contactName}" <${props.contactEmail}>`,
      },
      handler: "index.handler",
      logGroup: contactMessageDeliveredEmailLogGroup,
      runtime: Runtime.NODEJS_26_X,
      timeout: Duration.seconds(30),
    },
  );

  const contactMessageNotificationEmailHandler = new Function(
    scope,
    "ContactMessageNotificationEmailHandler",
    {
      architecture: Architecture.ARM_64,
      code: new AssetCode(dockerImage.cp("/output/contactMessageNotificationEmailHandler/.")),
      environment: {
        S3_BUCKET_NAME: props.contactMessagesAttachmentsBucket.bucketName,
        SES_CONFIGURATION_SET_NAME:
          props.contactEmailConfigurationSet.configurationSetName,
        SES_RECIPIENT_EMAIL: props.notificationRecipientEmail,
        SES_SENDER_EMAIL: `"${props.notificationSenderName}" <${props.notificationSenderEmail}>`,
      },
      handler: "index.handler",
      logGroup: contactMessageNotificationEmailLogGroup,
      runtime: Runtime.NODEJS_26_X,
      timeout: Duration.seconds(30),
    },
  );

  new EventInvokeConfig(
    scope,
    "ContactMessageDeliveredEmailInvokeConfig",
    {
      function: contactMessageDeliveredEmailHandler,
      maxEventAge: Duration.hours(6),
      onFailure: new SqsDestination(props.contactAsyncDlq),
      retryAttempts: 2,
    },
  );

  new EventInvokeConfig(
    scope,
    "ContactMessageNotificationEmailInvokeConfig",
    {
      function: contactMessageNotificationEmailHandler,
      maxEventAge: Duration.hours(6),
      onFailure: new SqsDestination(props.contactAsyncDlq),
      retryAttempts: 2,
    },
  );

  props.contactMessagesAttachmentsBucket.grantReadWrite(contactMessageHandler);
  props.contactMessagesAttachmentsBucket
    .grantRead(contactMessageNotificationEmailHandler);
  props.contactMessagesTable.grantReadWriteData(contactMessageHandler);
  props.contactMessagesTopic.grantPublish(contactMessageHandler);

  const stack = Stack.of(scope);
  const sesIdentityArn = `arn:aws:ses:${stack.region}:${stack.account}:identity/${props.websiteDomainName}`;
  const sesConfigurationSetArn = stack.formatArn({
    resource: "configuration-set",
    resourceName: props.contactEmailConfigurationSet.configurationSetName,
    service: "ses",
  });
  const sesPolicy = new PolicyStatement({
    actions: [
      "ses:SendEmail",
      "ses:SendRawEmail",
    ],
    effect: Effect.ALLOW,
    resources: [
      sesIdentityArn,
      sesConfigurationSetArn,
    ],
  });

  contactMessageDeliveredEmailHandler.addToRolePolicy(sesPolicy);
  contactMessageNotificationEmailHandler.addToRolePolicy(sesPolicy);

  props.contactMessagesTopic
    .addSubscription(
      new LambdaSubscription(
        contactMessageDeliveredEmailHandler,
        { deadLetterQueue: props.contactAsyncDlq },
      ),
    );
  props.contactMessagesTopic
    .addSubscription(
      new LambdaSubscription(
        contactMessageNotificationEmailHandler,
        { deadLetterQueue: props.contactAsyncDlq },
      ),
    );

  return {
    contactMessageDeliveredEmailHandler,
    contactMessageHandler,
    contactMessageNotificationEmailHandler,
    dockerImage,
  };
};

export { createContactFunctions };
