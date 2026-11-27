import { Stack, type StackProps } from "aws-cdk-lib";
import {
  Certificate,
  CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { type IHostedZone } from "aws-cdk-lib/aws-route53";
import { type Construct } from "constructs";

import {
  WEBSITE_WAF_RATE_LIMIT,
  WEBSITE_WAF_RATE_WINDOW_SECONDS,
} from "../constants/security";
import { COMMON_MANAGED_RULE_NAMES, WafWebAcl } from "../constructs/waf";

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

    const websiteWaf = new WafWebAcl(
      this,
      "WebsiteWaf",
      {
        logGroupName: "aws-waf-logs-mileszko-website",
        logRetention: RetentionDays.ONE_MONTH,
        managedRuleNames: COMMON_MANAGED_RULE_NAMES,
        name: "mileszko-website",
        rateLimit: WEBSITE_WAF_RATE_LIMIT,
        rateRuleName: "RateLimit",
        rateRulePriority: 3,
        rateWindowSeconds: WEBSITE_WAF_RATE_WINDOW_SECONDS,
        scope: "CLOUDFRONT",
        visibilityMetricName: "mileszko-website",
      },
    );

    this.webAclArn = websiteWaf.webAclArn;
  }
}

export { WebsiteEdgeStack };
