import { Stack, type StackProps } from "aws-cdk-lib";
import {
  Certificate,
  CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { type IHostedZone } from "aws-cdk-lib/aws-route53";
import { CfnLoggingConfiguration, CfnWebACL } from "aws-cdk-lib/aws-wafv2";
import { type Construct } from "constructs";

import {
  WEBSITE_WAF_RATE_LIMIT,
  WEBSITE_WAF_RATE_WINDOW_SECONDS,
} from "../constants/security";

interface WebsiteEdgeStackProps extends StackProps {
  hostedZone: IHostedZone
  websiteDomainName: string
}

class WebsiteEdgeStack extends Stack {
  public readonly certificate: Certificate;
  public readonly webAclArn: string;

  constructor(scope: Construct, id: string, props: WebsiteEdgeStackProps) {
    super(
      scope,
      id,
      {
        ...props,
        terminationProtection: true,
      },
    );

    const wwwWebsiteDomainName = `www.${props.websiteDomainName}`;

    this.certificate = new Certificate(
      this,
      "Certificate",
      {
        domainName: props.websiteDomainName,
        subjectAlternativeNames: [wwwWebsiteDomainName],
        validation: CertificateValidation.fromDns(props.hostedZone),
      },
    );

    const webAcl = new CfnWebACL(
      this,
      "WebAcl",
      {
        defaultAction: { allow: {} },
        name: "mileszko-website",
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
            visibilityConfig: {
              cloudWatchMetricsEnabled: true,
              metricName: "AWSManagedRulesCommonRuleSet",
              sampledRequestsEnabled: true,
            },
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
            visibilityConfig: {
              cloudWatchMetricsEnabled: true,
              metricName: "AWSManagedRulesKnownBadInputsRuleSet",
              sampledRequestsEnabled: true,
            },
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
            visibilityConfig: {
              cloudWatchMetricsEnabled: true,
              metricName: "AWSManagedRulesAmazonIpReputationList",
              sampledRequestsEnabled: true,
            },
          },
          {
            action: { block: {} },
            name: "RateLimit",
            priority: 3,
            statement: {
              rateBasedStatement: {
                aggregateKeyType: "IP",
                evaluationWindowSec: WEBSITE_WAF_RATE_WINDOW_SECONDS,
                limit: WEBSITE_WAF_RATE_LIMIT,
              },
            },
            visibilityConfig: {
              cloudWatchMetricsEnabled: true,
              metricName: "RateLimit",
              sampledRequestsEnabled: true,
            },
          },
        ],
        scope: "CLOUDFRONT",
        visibilityConfig: {
          cloudWatchMetricsEnabled: true,
          metricName: "mileszko-website",
          sampledRequestsEnabled: true,
        },
      },
    );

    this.webAclArn = webAcl.attrArn;

    const logGroup = new LogGroup(
      this,
      "WafLogGroup",
      {
        logGroupName: "aws-waf-logs-mileszko-website",
        retention: RetentionDays.ONE_MONTH,
      },
    );

    new CfnLoggingConfiguration(
      this,
      "WafLoggingConfiguration",
      {
        logDestinationConfigs: [logGroup.logGroupArn],
        resourceArn: webAcl.attrArn,
      },
    );
  }
}

export { WebsiteEdgeStack };
