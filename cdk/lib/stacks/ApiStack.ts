import {
  DockerImage,
  Duration,
  RemovalPolicy,
  Stack,
  type StackProps,
} from "aws-cdk-lib";
import {
  AccessLogFormat,
  ApiDefinition,
  BasePathMapping,
  Cors,
  DomainName,
  LogGroupLogDestination,
  MethodLoggingLevel,
  SpecRestApi,
} from "aws-cdk-lib/aws-apigateway";
import { BackupPlan, BackupResource } from "aws-cdk-lib/aws-backup";
import {
  Certificate,
  CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";
import {
  Alarm,
  ComparisonOperator,
  Metric,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";
import { SnsAction } from "aws-cdk-lib/aws-cloudwatch-actions";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { Effect, PolicyStatement, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Key } from "aws-cdk-lib/aws-kms";
import {
  Architecture,
  AssetCode,
  EventInvokeConfig,
  Function,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { SqsDestination } from "aws-cdk-lib/aws-lambda-destinations";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import {
  ARecord,
  type IHostedZone,
  RecordTarget,
} from "aws-cdk-lib/aws-route53";
import { ApiGatewayDomain } from "aws-cdk-lib/aws-route53-targets";
import { Bucket, BucketAccessControl } from "aws-cdk-lib/aws-s3";
import {
  ConfigurationSet,
  ConfigurationSetEventDestination,
  ConfigurationSetTlsPolicy,
  EmailSendingEvent,
  EventDestination,
} from "aws-cdk-lib/aws-ses";
import { Topic } from "aws-cdk-lib/aws-sns";
import {
  EmailSubscription,
  LambdaSubscription,
} from "aws-cdk-lib/aws-sns-subscriptions";
import { Queue, QueueEncryption } from "aws-cdk-lib/aws-sqs";
import {
  CfnLoggingConfiguration,
  CfnWebACL,
  CfnWebACLAssociation,
} from "aws-cdk-lib/aws-wafv2";
import { type Construct } from "constructs";
import fs from "node:fs";
import path from "node:path";
import { type OpenAPIObject } from "openapi3-ts/oas30";

import {
  CONTACT_API_RATE_LIMIT,
  CONTACT_API_RATE_WINDOW_SECONDS,
  CONTACT_API_RESERVED_CONCURRENCY,
  CONTACT_API_THROTTLE_BURST_LIMIT,
  CONTACT_API_THROTTLE_RATE_LIMIT,
  CONTACT_DATA_RETENTION_DAYS,
  HSTS_MAX_AGE_SECONDS,
  SES_BOUNCE_RATE_THRESHOLD,
  SES_COMPLAINT_RATE_THRESHOLD,
} from "../constants/security";

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

    const contactMessagesAttachmentsBucket = new Bucket(
      this,
      "ContactMessagesAttachmentsBucket",
      {
        accessControl: BucketAccessControl.PRIVATE,
        lifecycleRules: [
          {
            abortIncompleteMultipartUploadAfter: Duration.days(1),
            expiration: Duration.days(CONTACT_DATA_RETENTION_DAYS),
            noncurrentVersionExpiration: Duration.days(30),
          },
        ],
        removalPolicy: RemovalPolicy.RETAIN,
        versioned: true,
      },
    );

    const contactMessagesTable = new Table(
      this,
      "ContactMessagesTable",
      {
        billingMode: BillingMode.PAY_PER_REQUEST,
        deletionProtection: true,
        partitionKey: {
          name: "Id",
          type: AttributeType.STRING,
        },
        pointInTimeRecoverySpecification: {pointInTimeRecoveryEnabled: true},
        removalPolicy: RemovalPolicy.RETAIN,
        timeToLiveAttribute: "ExpiresAt",
      },
    );

    const contactBackupPlan = BackupPlan.daily35DayRetention(
      this,
      "ContactBackupPlan",
    );

    contactBackupPlan.addSelection(
      "ContactMessagesBackup",
      {
        allowRestores: true,
        resources: [BackupResource.fromDynamoDbTable(contactMessagesTable)],
      },
    );

    const snsKey = new Key(
      this,
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
      this,
      "ContactMessagesTopic",
      { masterKey: snsKey },
    );

    const emailFeedbackTopic = new Topic(
      this,
      "EmailFeedbackTopic",
      { masterKey: snsKey },
    );

    const contactEmailConfigurationSet = new ConfigurationSet(
      this,
      "ContactEmailConfigurationSet",
      {
        reputationMetrics: true,
        sendingEnabled: true,
        tlsPolicy: ConfigurationSetTlsPolicy.REQUIRE,
      },
    );

    new ConfigurationSetEventDestination(
      this,
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

    const contactMessageLogGroup = new LogGroup(
      this,
      "ContactMessageLogGroup",
      { retention: RetentionDays.THREE_MONTHS },
    );
    const contactMessageDeliveredEmailLogGroup = new LogGroup(
      this,
      "ContactMessageDeliveredEmailLogGroup",
      { retention: RetentionDays.THREE_MONTHS },
    );
    const contactMessageNotificationEmailLogGroup = new LogGroup(
      this,
      "ContactMessageNotificationEmailLogGroup",
      { retention: RetentionDays.THREE_MONTHS },
    );

    const apiAccessLogGroup = new LogGroup(
      this,
      "ApiAccessLogGroup",
      { retention: RetentionDays.ONE_MONTH },
    );

    const alarmTopic = new Topic(
      this,
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
      this,
      "ContactAsyncDlq",
      {
        encryption: QueueEncryption.SQS_MANAGED,
        enforceSSL: true,
        retentionPeriod: Duration.days(14),
      },
    );

    const dockerImage = DockerImage.fromBuild(
      "../",
      { file: "api/Dockerfile" },
    );

    const contactMessageHandler = new Function(
      this,
      "ContactMessageHandler",
      {
        architecture: Architecture.ARM_64,
        code: new AssetCode(dockerImage.cp("/output/contactMessageHandler/.")),
        environment: {
          DYNAMODB_TABLE_NAME: contactMessagesTable.tableName,
          S3_BUCKET_NAME: contactMessagesAttachmentsBucket.bucketName,
          SNS_TOPIC_ARN: contactMessagesTopic.topicArn,
        },
        handler: "index.handler",
        logGroup: contactMessageLogGroup,
        reservedConcurrentExecutions: CONTACT_API_RESERVED_CONCURRENCY,
        runtime: Runtime.NODEJS_26_X,
        timeout: Duration.seconds(30),
      },
    );

    const contactMessageDeliveredEmailHandler = new Function(
      this,
      "ContactMessageDeliveredEmailHandler",
      {
        architecture: Architecture.ARM_64,
        code: new AssetCode(dockerImage.cp("/output/contactMessageDeliveredEmailHandler/.")),
        environment: {
          SES_CONFIGURATION_SET_NAME:
            contactEmailConfigurationSet.configurationSetName,
          SES_SENDER_EMAIL: `"${props.contactName}" <${props.contactEmail}>`,
        },
        handler: "index.handler",
        logGroup: contactMessageDeliveredEmailLogGroup,
        runtime: Runtime.NODEJS_26_X,
        timeout: Duration.seconds(30),
      },
    );

    const contactMessageNotificationEmailHandler = new Function(
      this,
      "ContactMessageNotificationEmailHandler",
      {
        architecture: Architecture.ARM_64,
        code: new AssetCode(dockerImage.cp("/output/contactMessageNotificationEmailHandler/.")),
        environment: {
          S3_BUCKET_NAME: contactMessagesAttachmentsBucket.bucketName,
          SES_CONFIGURATION_SET_NAME:
            contactEmailConfigurationSet.configurationSetName,
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
      this,
      "ContactMessageDeliveredEmailInvokeConfig",
      {
        function: contactMessageDeliveredEmailHandler,
        maxEventAge: Duration.hours(6),
        onFailure: new SqsDestination(contactAsyncDlq),
        retryAttempts: 2,
      },
    );

    new EventInvokeConfig(
      this,
      "ContactMessageNotificationEmailInvokeConfig",
      {
        function: contactMessageNotificationEmailHandler,
        maxEventAge: Duration.hours(6),
        onFailure: new SqsDestination(contactAsyncDlq),
        retryAttempts: 2,
      },
    );

    contactMessagesAttachmentsBucket.grantReadWrite(contactMessageHandler);
    contactMessagesAttachmentsBucket
      .grantRead(contactMessageNotificationEmailHandler);
    contactMessagesTable.grantReadWriteData(contactMessageHandler);
    contactMessagesTopic.grantPublish(contactMessageHandler);

    const sesIdentityArn = `arn:aws:ses:${this.region}:${this.account}:identity/${props.websiteDomainName}`;
    const sesConfigurationSetArn = this.formatArn({
      resource: "configuration-set",
      resourceName: contactEmailConfigurationSet.configurationSetName,
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

    contactMessagesTopic
      .addSubscription(
        new LambdaSubscription(
          contactMessageDeliveredEmailHandler,
          { deadLetterQueue: contactAsyncDlq },
        ),
      );
    contactMessagesTopic
      .addSubscription(
        new LambdaSubscription(
          contactMessageNotificationEmailHandler,
          { deadLetterQueue: contactAsyncDlq },
        ),
      );

    const apiDefinitionDirectory = dockerImage.cp("/output/api.json");

    const apiDefinition = JSON.parse(
      fs.readFileSync(
        path.join(
          apiDefinitionDirectory,
          "api.json",
        ),
        "utf8",
      ),
    ) as OpenAPIObject;

    apiDefinition["x-amazon-apigateway-binary-media-types"] = ["multipart/form-data"];

    const apiResponseParameters = {
      "method.response.header.Access-Control-Allow-Headers": `'${Cors.DEFAULT_HEADERS.join(",")}'`,
      "method.response.header.Access-Control-Allow-Methods": "'POST,OPTIONS'",
      "method.response.header.Access-Control-Allow-Origin": `'https://${props.websiteDomainName}'`,
      "method.response.header.Cache-Control": "'no-store'",
      "method.response.header.Permissions-Policy": "'camera=(), microphone=(), geolocation=()'",
      "method.response.header.Referrer-Policy": "'strict-origin-when-cross-origin'",
      "method.response.header.Strict-Transport-Security":
        `'max-age=${HSTS_MAX_AGE_SECONDS}'`,
      "method.response.header.Vary": "'Origin'",
      "method.response.header.X-Content-Type-Options": "'nosniff'",
      "method.response.header.X-Frame-Options": "'DENY'",
    };

    const contactMessagesPath = apiDefinition.paths["/contact/messages"];

    if (contactMessagesPath.post) {
      contactMessagesPath.post["x-amazon-apigateway-integration"] = {
        httpMethod: "POST",
        passthroughBehavior: "when_no_templates",
        requestTemplates: {
          "multipart/form-data": `#set($allParams = $input.params())
#set($headers = $allParams.get("header"))
#set($contentType = "application/octet-stream")
#foreach($headerName in $headers.keySet())
  #if($headerName.toLowerCase() == "content-type")
    #set($contentType = $headers.get($headerName))
    #break
  #end
#end
{
  "body": "$input.body",
  "contentType": "$util.escapeJavaScript($contentType)"
}`,
        },
        responses: {
          "": {
            responseParameters: apiResponseParameters,
            statusCode: "200",
          },
          "Internal error.*": {
            responseParameters: apiResponseParameters,
            responseTemplates: {
              "application/json": `{
                "errorMessage": "Internal error",
                "requestId": "$context.requestId"
              }`,
            },
            statusCode: "500",
          },
          "Invalid input data.*": {
            responseParameters: apiResponseParameters,
            responseTemplates: {
              "application/json": `{
                "errorMessage": "Invalid input data",
                "requestId": "$context.requestId"
              }`,
            },
            statusCode: "400",
          },
        },
        type: "aws",
        uri: `arn:aws:apigateway:${this.region}:lambda:path/2015-03-31/functions/${contactMessageHandler.functionArn}/invocations`,
      };
    }
    else {
      throw new Error("Contact messages path not found.");
    }

    if (contactMessagesPath.options) {
      contactMessagesPath.options["x-amazon-apigateway-integration"] = {
        httpMethod: "OPTIONS",
        requestTemplates: { "application/json": "{ statusCode: 200 }" },
        responses: {
          "": {
            responseParameters: apiResponseParameters,
            statusCode: "204",
          },
        },
        type: "mock",
      };
    }
    else {
      throw new Error("Contact messages path options not found.");
    }

    const api = new SpecRestApi(
      this,
      "Api",
      {
        apiDefinition: ApiDefinition.fromInline(apiDefinition),
        deploy: true,
        deployOptions: {
          accessLogDestination: new LogGroupLogDestination(apiAccessLogGroup),
          accessLogFormat: AccessLogFormat.jsonWithStandardFields(),
          dataTraceEnabled: false,
          loggingLevel: MethodLoggingLevel.ERROR,
          metricsEnabled: true,
          stageName: "prod",
          throttlingBurstLimit: CONTACT_API_THROTTLE_BURST_LIMIT,
          throttlingRateLimit: CONTACT_API_THROTTLE_RATE_LIMIT,
        },
        disableExecuteApiEndpoint: true,
      },
    );

    const wafVisibilityConfig = {
      cloudWatchMetricsEnabled: true,
      metricName: "contact-api-waf",
      sampledRequestsEnabled: true,
    };

    const webAcl = new CfnWebACL(
      this,
      "ContactApiWebAcl",
      {
        defaultAction: { allow: {} },
        rules: [
          {
            name: "AWSManagedRulesCommonRuleSet",
            overrideAction: { none: {} },
            priority: 0,
            statement: {
              managedRuleGroupStatement: {
                name: "AWSManagedRulesCommonRuleSet",
                vendorName: "AWS",
              },
            },
            visibilityConfig: wafVisibilityConfig,
          },
          {
            name: "AWSManagedRulesKnownBadInputsRuleSet",
            overrideAction: { none: {} },
            priority: 1,
            statement: {
              managedRuleGroupStatement: {
                name: "AWSManagedRulesKnownBadInputsRuleSet",
                vendorName: "AWS",
              },
            },
            visibilityConfig: wafVisibilityConfig,
          },
          {
            name: "AWSManagedRulesAmazonIpReputationList",
            overrideAction: { none: {} },
            priority: 2,
            statement: {
              managedRuleGroupStatement: {
                name: "AWSManagedRulesAmazonIpReputationList",
                vendorName: "AWS",
              },
            },
            visibilityConfig: wafVisibilityConfig,
          },
          {
            name: "AWSManagedRulesAnonymousIpList",
            overrideAction: { none: {} },
            priority: 3,
            statement: {
              managedRuleGroupStatement: {
                name: "AWSManagedRulesAnonymousIpList",
                vendorName: "AWS",
              },
            },
            visibilityConfig: wafVisibilityConfig,
          },
          {
            action: { block: {} },
            name: "RateLimitContactApi",
            priority: 10,
            statement: {
              rateBasedStatement: {
                aggregateKeyType: "IP",
                evaluationWindowSec: CONTACT_API_RATE_WINDOW_SECONDS,
                limit: CONTACT_API_RATE_LIMIT,
              },
            },
            visibilityConfig: wafVisibilityConfig,
          },
        ],
        scope: "REGIONAL",
        visibilityConfig: wafVisibilityConfig,
      },
    );

    new CfnWebACLAssociation(
      this,
      "ContactApiWebAclAssociation",
      {
        resourceArn: api.deploymentStage.stageArn,
        webAclArn: webAcl.attrArn,
      },
    );

    const wafLogGroup = new LogGroup(
      this,
      "ContactApiWafLogGroup",
      {
        logGroupName: "aws-waf-logs-contact-api",
        retention: RetentionDays.ONE_MONTH,
      },
    );

    new CfnLoggingConfiguration(
      this,
      "ContactApiWafLogging",
      {
        logDestinationConfigs: [wafLogGroup.logGroupArn],
        resourceArn: webAcl.attrArn,
      },
    );

    const alarmAction = new SnsAction(alarmTopic);

    const contactHandlerErrorsAlarm = new Alarm(
      this,
      "ContactHandlerErrorsAlarm",
      {
        alarmDescription: "Contact message handler is returning errors.",
        comparisonOperator:
          ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
        evaluationPeriods: 1,
        metric: contactMessageHandler.metricErrors({
          period: Duration.minutes(5),
          statistic: "Sum",
        }),
        threshold: 1,
        treatMissingData: TreatMissingData.NOT_BREACHING,
      },
    );

    contactHandlerErrorsAlarm.addAlarmAction(alarmAction);

    const contactApiServerErrorsAlarm = new Alarm(
      this,
      "ContactApiServerErrorsAlarm",
      {
        alarmDescription: "Contact API is returning server errors.",
        comparisonOperator:
          ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
        evaluationPeriods: 1,
        metric: api.metricServerError({
          period: Duration.minutes(5),
          statistic: "Sum",
        }),
        threshold: 1,
        treatMissingData: TreatMissingData.NOT_BREACHING,
      },
    );

    contactApiServerErrorsAlarm.addAlarmAction(alarmAction);

    const sesBounceRateAlarm = new Alarm(
      this,
      "SesBounceRateAlarm",
      {
        alarmDescription: `SES bounce rate is above ${SES_BOUNCE_RATE_THRESHOLD * 100}%.`,
        comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
        evaluationPeriods: 1,
        metric: new Metric({
          dimensionsMap: {
            ConfigurationSet:
              contactEmailConfigurationSet.configurationSetName,
          },
          metricName: "Reputation.BounceRate",
          namespace: "AWS/SES",
          period: Duration.minutes(5),
          statistic: "Average",
        }),
        threshold: SES_BOUNCE_RATE_THRESHOLD,
        treatMissingData: TreatMissingData.NOT_BREACHING,
      },
    );

    sesBounceRateAlarm.addAlarmAction(alarmAction);

    const sesComplaintRateAlarm = new Alarm(
      this,
      "SesComplaintRateAlarm",
      {
        alarmDescription: `SES complaint rate is above ${SES_COMPLAINT_RATE_THRESHOLD * 100}%.`,
        comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
        evaluationPeriods: 1,
        metric: new Metric({
          dimensionsMap: {
            ConfigurationSet:
              contactEmailConfigurationSet.configurationSetName,
          },
          metricName: "Reputation.ComplaintRate",
          namespace: "AWS/SES",
          period: Duration.minutes(5),
          statistic: "Average",
        }),
        threshold: SES_COMPLAINT_RATE_THRESHOLD,
        treatMissingData: TreatMissingData.NOT_BREACHING,
      },
    );

    sesComplaintRateAlarm.addAlarmAction(alarmAction);

    const contactMessageNotificationErrorsAlarm = new Alarm(
      this,
      "ContactMessageNotificationErrorsAlarm",
      {
        alarmDescription: "The contact notification email handler is failing.",
        comparisonOperator:
          ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
        evaluationPeriods: 1,
        metric: contactMessageNotificationEmailHandler.metricErrors({
          period: Duration.minutes(5),
          statistic: "Sum",
        }),
        threshold: 1,
        treatMissingData: TreatMissingData.NOT_BREACHING,
      },
    );

    contactMessageNotificationErrorsAlarm.addAlarmAction(alarmAction);

    const contactMessageDeliveredErrorsAlarm = new Alarm(
      this,
      "ContactMessageDeliveredErrorsAlarm",
      {
        alarmDescription: "The contact delivered-email handler is failing.",
        comparisonOperator:
          ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
        evaluationPeriods: 1,
        metric: contactMessageDeliveredEmailHandler.metricErrors({
          period: Duration.minutes(5),
          statistic: "Sum",
        }),
        threshold: 1,
        treatMissingData: TreatMissingData.NOT_BREACHING,
      },
    );

    contactMessageDeliveredErrorsAlarm.addAlarmAction(alarmAction);

    const contactAsyncDlqAlarm = new Alarm(
      this,
      "ContactAsyncDlqAlarm",
      {
        alarmDescription: "Failed contact email work is waiting in the DLQ.",
        comparisonOperator:
          ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
        evaluationPeriods: 1,
        metric: contactAsyncDlq.metricApproximateNumberOfMessagesVisible({
          period: Duration.minutes(5),
          statistic: "Maximum",
        }),
        threshold: 1,
        treatMissingData: TreatMissingData.NOT_BREACHING,
      },
    );

    contactAsyncDlqAlarm.addAlarmAction(alarmAction);

    const contactMessagesTopicFailuresAlarm = new Alarm(
      this,
      "ContactMessagesTopicFailuresAlarm",
      {
        alarmDescription: "SNS failed to deliver a contact message.",
        comparisonOperator:
          ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
        evaluationPeriods: 1,
        metric: contactMessagesTopic.metricNumberOfNotificationsFailed({
          period: Duration.minutes(5),
          statistic: "Sum",
        }),
        threshold: 1,
        treatMissingData: TreatMissingData.NOT_BREACHING,
      },
    );

    contactMessagesTopicFailuresAlarm.addAlarmAction(alarmAction);

    contactMessageHandler.addPermission(
      "InvokeUrl",
      {
        principal: new ServicePrincipal("apigateway.amazonaws.com"),
        scope: api,
        sourceArn: api.arnForExecuteApi(
          "POST",
          "/contact/messages",
        ),
      },
    );

    const certificate = new Certificate(
      this,
      "Certificate",
      {
        domainName: props.apiDomainName,
        validation: CertificateValidation.fromDns(props.hostedZone),
      },
    );

    const apiDomain = new DomainName(
      this,
      "ApiDomainName",
      {
        certificate,
        domainName: props.apiDomainName,
      },
    );

    new BasePathMapping(
      this,
      "ApiBasePathMapping",
      {
        domainName: apiDomain,
        restApi: api,
      },
    );

    new ARecord(
      this,
      "AliasRecord",
      {
        recordName: props.apiDomainName + ".",
        target: RecordTarget.fromAlias(new ApiGatewayDomain(apiDomain)),
        zone: props.hostedZone,
      },
    );
  }
}
