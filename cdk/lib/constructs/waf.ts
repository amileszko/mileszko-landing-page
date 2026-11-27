import { LogGroup, type RetentionDays } from "aws-cdk-lib/aws-logs";
import { CfnLoggingConfiguration, CfnWebACL } from "aws-cdk-lib/aws-wafv2";
import { Construct } from "constructs";

import { managedRule, rateRule } from "./wafRules";

const COMMON_MANAGED_RULE_NAMES = [
  "AWSManagedRulesCommonRuleSet",
  "AWSManagedRulesKnownBadInputsRuleSet",
  "AWSManagedRulesAmazonIpReputationList",
];

const API_MANAGED_RULE_NAMES = [
  ...COMMON_MANAGED_RULE_NAMES,
  "AWSManagedRulesAnonymousIpList",
];

interface WafWebAclProps {
  logGroupName: string
  logRetention: RetentionDays
  managedRuleNames: string[]
  name: string
  rateLimit: number
  rateRuleName: string
  rateRulePriority: number
  rateWindowSeconds: number
  scope: "CLOUDFRONT" | "REGIONAL"
  visibilityMetricName: string
}

class WafWebAcl extends Construct {
  public readonly webAclArn: string;

  constructor(
    scope: Construct,
    id: string,
    props: WafWebAclProps,
  ) {
    super(
      scope,
      id,
    );

    const visibilityConfig = {
      cloudWatchMetricsEnabled: true,
      metricName: props.visibilityMetricName,
      sampledRequestsEnabled: true,
    };

    const webAcl = new CfnWebACL(
      this,
      "WebAcl",
      {
        defaultAction: { allow: {} },
        name: props.name,
        rules: [
          ...props.managedRuleNames.map((ruleName, index) =>
            managedRule(
              ruleName,
              index,
              visibilityConfig,
            )),
          rateRule({
            limit: props.rateLimit,
            name: props.rateRuleName,
            priority: props.rateRulePriority,
            visibilityConfig,
            windowSeconds: props.rateWindowSeconds,
          }),
        ],
        scope: props.scope,
        visibilityConfig,
      },
    );

    this.webAclArn = webAcl.attrArn;

    const logGroup = new LogGroup(
      this,
      "LogGroup",
      {
        logGroupName: props.logGroupName,
        retention: props.logRetention,
      },
    );

    new CfnLoggingConfiguration(
      this,
      "LoggingConfiguration",
      {
        logDestinationConfigs: [logGroup.logGroupArn],
        resourceArn: webAcl.attrArn,
      },
    );
  }
}

export {
  API_MANAGED_RULE_NAMES,
  COMMON_MANAGED_RULE_NAMES,
  WafWebAcl,
  type WafWebAclProps,
};
