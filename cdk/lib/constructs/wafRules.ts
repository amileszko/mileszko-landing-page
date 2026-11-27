import { type CfnWebACL } from "aws-cdk-lib/aws-wafv2";

const managedRule = (
  name: string,
  priority: number,
  visibilityConfig: CfnWebACL.VisibilityConfigProperty,
): CfnWebACL.RuleProperty => ({
  name,
  overrideAction: { none: {} },
  priority,
  statement: {
    managedRuleGroupStatement: {
      name,
      vendorName: "AWS",
    },
  },
  visibilityConfig,
});

const rateRule = ({
  limit,
  name,
  priority,
  visibilityConfig,
  windowSeconds,
}: {
  limit: number
  name: string
  priority: number
  visibilityConfig: CfnWebACL.VisibilityConfigProperty
  windowSeconds: number
}): CfnWebACL.RuleProperty => ({
  action: { block: {} },
  name,
  priority,
  statement: {
    rateBasedStatement: {
      aggregateKeyType: "IP",
      evaluationWindowSec: windowSeconds,
      limit,
    },
  },
  visibilityConfig,
});

export { managedRule, rateRule };
