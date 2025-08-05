import { Stack, type StackProps } from "aws-cdk-lib";
import {
  type IHostedZone,
  PublicHostedZone,
  TxtRecord,
} from "aws-cdk-lib/aws-route53";
import { EmailIdentity, Identity } from "aws-cdk-lib/aws-ses";
import { type Construct } from "constructs";

interface PublicInfrastructureStackProps extends StackProps {
  rootDomainName: string
}

export class PublicInfrastructureStack extends Stack {
  public readonly hostedZone: IHostedZone;

  constructor(
    scope: Construct,
    id: string,
    props: PublicInfrastructureStackProps,
  ) {
    super(
      scope,
      id,
      props,
    );

    this.hostedZone = new PublicHostedZone(
      this,
      "PublicHostedZone",
      { zoneName: props.rootDomainName },
    );

    new EmailIdentity(
      this,
      "EmailIdentity",
      {
        identity: Identity.publicHostedZone(this.hostedZone),
        mailFromDomain: `mail.${props.rootDomainName}`,
      },
    );

    new TxtRecord(
      this,
      "DmarcRecord",
      {
        recordName: "_dmarc." + props.rootDomainName,
        values: [`v=DMARC1; p=none; rua=mailto:dmarc-reports@${props.rootDomainName}; ruf=mailto:dmarc-failures@${props.rootDomainName}; fo=1; adkim=r; aspf=r; pct=100; rf=afrf; ri=86400`],
        zone: this.hostedZone,
      },
    );

    new TxtRecord(
      this,
      "MailFromSpfRecord",
      {
        recordName: "mail",
        values: ["v=spf1 include:amazonses.com ~all"],
        zone: this.hostedZone,
      },
    );

    new TxtRecord(
      this,
      "SpfRecord",
      {
        values: ["v=spf1 include:amazonses.com ~all"],
        zone: this.hostedZone,
      },
    );
  }
}
