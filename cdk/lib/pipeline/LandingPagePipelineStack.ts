import { type StackProps } from "aws-cdk-lib";
import { SecretValue, Stack } from "aws-cdk-lib";
import { PipelineType } from "aws-cdk-lib/aws-codepipeline";
import {
  CodeBuildStep,
  CodePipeline,
  CodePipelineSource,
} from "aws-cdk-lib/pipelines";
import { type Construct } from "constructs";

import {
  type Environment,
  type Repository,
  type Secret,
} from "../../config/config";
import { LandingPageStage } from "../stages/LandingPageStage";

interface LandingPagePipelineStackProps extends StackProps {
  environments: {
    prod: Environment
  }
  githubToken: Secret
  repository: Repository
}

class LandingPagePipelineStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: LandingPagePipelineStackProps,
  ) {
    super(
      scope,
      id,
      props,
    );

    const synth = new CodeBuildStep(
      "Synth",
      {
        commands: [
          "corepack enable",
          "yarn workspaces focus @mileszko-landing-page/monorepo @mileszko-landing-page/cdk",
          "yarn cdk:synth",
        ],
        input: CodePipelineSource.gitHub(
          `${props.repository.owner}/${props.repository.name}`,
          props.repository.branch,
          {
            authentication: SecretValue.secretsManager(
              props.githubToken.secretId,
              { jsonField: props.githubToken.jsonField },
            ),
          },
        ),
        primaryOutputDirectory: "cdk/cdk.out",
      },
    );

    const landingPagePipeline = new CodePipeline(
      this,
      "LandingPagePipeline",
      {
        pipelineName: "LandingPagePipeline",
        pipelineType: PipelineType.V2,
        synth: synth,
      },
    );

    landingPagePipeline.addStage(new LandingPageStage(
      this,
      "prod",
      {
        apiDomainName: props.environments.prod.apiDomainName,
        contactEmail: props.environments.prod.contactEmail,
        contactName: props.environments.prod.contactName,
        googleTagManagerId: props.environments.prod.googleTagManagerId,
        notificationRecipientEmail:
        props.environments.prod.notificationRecipientEmail,
        notificationSenderEmail:
        props.environments.prod.notificationSenderEmail,
        notificationSenderName: props.environments.prod.notificationSenderName,
        rootDomainName: props.environments.prod.rootDomainName,
        websiteDomainName: props.environments.prod.websiteDomainName,
      },
    ));
  }
}

export { LandingPagePipelineStack };
