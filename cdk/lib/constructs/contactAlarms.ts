import { Duration } from "aws-cdk-lib";
import { type SpecRestApi } from "aws-cdk-lib/aws-apigateway";
import {
  Alarm,
  ComparisonOperator,
  Metric,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";
import { SnsAction } from "aws-cdk-lib/aws-cloudwatch-actions";
import { type Function } from "aws-cdk-lib/aws-lambda";
import { type ConfigurationSet } from "aws-cdk-lib/aws-ses";
import { type Topic } from "aws-cdk-lib/aws-sns";
import { type Queue } from "aws-cdk-lib/aws-sqs";
import { type Construct } from "constructs";

import {
  SES_BOUNCE_RATE_THRESHOLD,
  SES_COMPLAINT_RATE_THRESHOLD,
} from "../constants/security";

const createContactAlarms = (
  scope: Construct,
  props: {
    alarmTopic: Topic
    api: SpecRestApi
    contactAsyncDlq: Queue
    contactEmailConfigurationSet: ConfigurationSet
    contactMessageDeliveredEmailHandler: Function
    contactMessageHandler: Function
    contactMessageNotificationEmailHandler: Function
    contactMessagesTopic: Topic
  },
) => {
  const alarmAction = new SnsAction(props.alarmTopic);

  const contactHandlerErrorsAlarm = new Alarm(
    scope,
    "ContactHandlerErrorsAlarm",
    {
      alarmDescription: "Contact message handler is returning errors.",
      comparisonOperator:
        ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      evaluationPeriods: 1,
      metric: props.contactMessageHandler.metricErrors({
        period: Duration.minutes(5),
        statistic: "Sum",
      }),
      threshold: 1,
      treatMissingData: TreatMissingData.NOT_BREACHING,
    },
  );

  contactHandlerErrorsAlarm.addAlarmAction(alarmAction);

  const contactApiServerErrorsAlarm = new Alarm(
    scope,
    "ContactApiServerErrorsAlarm",
    {
      alarmDescription: "Contact API is returning server errors.",
      comparisonOperator:
        ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      evaluationPeriods: 1,
      metric: props.api.metricServerError({
        period: Duration.minutes(5),
        statistic: "Sum",
      }),
      threshold: 1,
      treatMissingData: TreatMissingData.NOT_BREACHING,
    },
  );

  contactApiServerErrorsAlarm.addAlarmAction(alarmAction);

  const sesBounceRateAlarm = new Alarm(
    scope,
    "SesBounceRateAlarm",
    {
      alarmDescription: `SES bounce rate is above ${SES_BOUNCE_RATE_THRESHOLD * 100}%.`,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
      evaluationPeriods: 1,
      metric: new Metric({
        dimensionsMap: {
          ConfigurationSet:
            props.contactEmailConfigurationSet.configurationSetName,
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
    scope,
    "SesComplaintRateAlarm",
    {
      alarmDescription: `SES complaint rate is above ${SES_COMPLAINT_RATE_THRESHOLD * 100}%.`,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
      evaluationPeriods: 1,
      metric: new Metric({
        dimensionsMap: {
          ConfigurationSet:
            props.contactEmailConfigurationSet.configurationSetName,
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
    scope,
    "ContactMessageNotificationErrorsAlarm",
    {
      alarmDescription: "The contact notification email handler is failing.",
      comparisonOperator:
        ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      evaluationPeriods: 1,
      metric: props.contactMessageNotificationEmailHandler.metricErrors({
        period: Duration.minutes(5),
        statistic: "Sum",
      }),
      threshold: 1,
      treatMissingData: TreatMissingData.NOT_BREACHING,
    },
  );

  contactMessageNotificationErrorsAlarm.addAlarmAction(alarmAction);

  const contactMessageDeliveredErrorsAlarm = new Alarm(
    scope,
    "ContactMessageDeliveredErrorsAlarm",
    {
      alarmDescription: "The contact delivered-email handler is failing.",
      comparisonOperator:
        ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      evaluationPeriods: 1,
      metric: props.contactMessageDeliveredEmailHandler.metricErrors({
        period: Duration.minutes(5),
        statistic: "Sum",
      }),
      threshold: 1,
      treatMissingData: TreatMissingData.NOT_BREACHING,
    },
  );

  contactMessageDeliveredErrorsAlarm.addAlarmAction(alarmAction);

  const contactAsyncDlqAlarm = new Alarm(
    scope,
    "ContactAsyncDlqAlarm",
    {
      alarmDescription: "Failed contact email work is waiting in the DLQ.",
      comparisonOperator:
        ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      evaluationPeriods: 1,
      metric: props.contactAsyncDlq.metricApproximateNumberOfMessagesVisible({
        period: Duration.minutes(5),
        statistic: "Maximum",
      }),
      threshold: 1,
      treatMissingData: TreatMissingData.NOT_BREACHING,
    },
  );

  contactAsyncDlqAlarm.addAlarmAction(alarmAction);

  const contactMessagesTopicFailuresAlarm = new Alarm(
    scope,
    "ContactMessagesTopicFailuresAlarm",
    {
      alarmDescription: "SNS failed to deliver a contact message.",
      comparisonOperator:
        ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      evaluationPeriods: 1,
      metric: props.contactMessagesTopic.metricNumberOfNotificationsFailed({
        period: Duration.minutes(5),
        statistic: "Sum",
      }),
      threshold: 1,
      treatMissingData: TreatMissingData.NOT_BREACHING,
    },
  );

  contactMessagesTopicFailuresAlarm.addAlarmAction(alarmAction);
};

export { createContactAlarms };
