import { Stack, type StackProps } from "aws-cdk-lib";
import {
  Certificate,
  CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";
import { type IHostedZone } from "aws-cdk-lib/aws-route53";
import { type Construct } from "constructs";

interface WebsiteEdgeStackProps extends StackProps {
  hostedZone: IHostedZone
  websiteDomainName: string
}

class WebsiteEdgeStack extends Stack {
  public readonly certificate: Certificate;

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
  }
}

export { WebsiteEdgeStack };
