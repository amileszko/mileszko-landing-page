import { Stack, type StageProps } from "aws-cdk-lib";
import { Stage } from "aws-cdk-lib";
import { type Construct } from "constructs";

import { ApiStack } from "../stacks/ApiStack";
import { PublicInfrastructureStack } from "../stacks/PublicInfrastructureStack";
import { WebsiteEdgeStack } from "../stacks/WebsiteEdgeStack";
import { WebsiteStack } from "../stacks/WebsiteStack";

interface LandingPageStageProps extends StageProps {
  apiDomainName: string
  contactEmail: string
  contactName: string
  googleTagManagerId: string
  notificationRecipientEmail: string
  notificationSenderEmail: string
  notificationSenderName: string
  rootDomainName: string
  websiteDomainName: string
}

class LandingPageStage extends Stage {
  constructor(
    scope: Construct,
    id: string,
    props: LandingPageStageProps,
  ) {
    super(
      scope,
      id,
      props,
    );

    const publicInfrastructureStack = new PublicInfrastructureStack(
      this,
      "PublicInfrastructureStack",
      { rootDomainName: props.rootDomainName },
    );

    new ApiStack(
      this,
      "ApiStack",
      {
        apiDomainName: props.apiDomainName,
        contactEmail: props.contactEmail,
        contactName: props.contactName,
        hostedZone: publicInfrastructureStack.hostedZone,
        notificationRecipientEmail: props.notificationRecipientEmail,
        notificationSenderEmail: props.notificationSenderEmail,
        notificationSenderName: props.notificationSenderName,
        websiteDomainName: props.websiteDomainName,
      },
    );

    const environment = {
      account: props.env?.account ?? Stack.of(scope).account,
      region: props.env?.region ?? Stack.of(scope).region,
    };

    const websiteEdgeStack = new WebsiteEdgeStack(
      this,
      "WebsiteEdgeStack",
      {
        crossRegionReferences: true,
        env: {
          account: environment.account,
          region: "us-east-1",
        },
        hostedZone: publicInfrastructureStack.hostedZone,
        websiteDomainName: props.websiteDomainName,
      },
    );

    new WebsiteStack(
      this,
      "WebsiteStack",
      {
        apiDomainName: props.apiDomainName,
        certificate: websiteEdgeStack.certificate,
        crossRegionReferences: true,
        env: environment,
        googleTagManagerId: props.googleTagManagerId,
        hostedZone: publicInfrastructureStack.hostedZone,
        webAclArn: websiteEdgeStack.webAclArn,
        websiteDomainName: props.websiteDomainName,
      },
    );
  }
}

export { LandingPageStage };
