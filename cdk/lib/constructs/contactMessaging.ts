import {
  ConfigurationSet,
  ConfigurationSetTlsPolicy,
} from "aws-cdk-lib/aws-ses";
import { Topic } from "aws-cdk-lib/aws-sns";
import { EmailSubscription } from "aws-cdk-lib/aws-sns-subscriptions";
import { type Construct } from "constructs";

const createContactMessaging = (
  scope: Construct,
  props: {
    notificationRecipientEmail: string
  },
) => {
  const contactMessagesTopic = new Topic(
    scope,
    "ContactMessagesTopic",
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

  const alarmTopic = new Topic(
    scope,
    "AlarmTopic",
    { displayName: "Contact API alarms" },
  );

  alarmTopic.addSubscription(
    new EmailSubscription(props.notificationRecipientEmail),
  );

  return {
    alarmTopic,
    contactEmailConfigurationSet,
    contactMessagesTopic,
  };
};

export { createContactMessaging };
