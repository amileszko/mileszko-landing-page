import { Stack, type StackProps } from "aws-cdk-lib";
import { BuildSpec } from "aws-cdk-lib/aws-codebuild";
import { PipelineType } from "aws-cdk-lib/aws-codepipeline";
import {
  CodeBuildStep,
  CodePipeline,
  CodePipelineSource,
  ManualApprovalStep,
} from "aws-cdk-lib/pipelines";
import { type Construct } from "constructs";

import { type Environment, type Repository } from "../../config/config";
import { LandingPageStage } from "../stages/LandingPageStage";

interface LandingPagePipelineStackProps extends StackProps {
  environments: {
    prod: Environment
  }
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
      {
        ...props,
        terminationProtection: true,
      },
    );

    const synth = new CodeBuildStep(
      "Synth",
      {
        commands: [
          "npm install -g pnpm@12.24.0",
          "pnpm --version",
          "pnpm install --frozen-lockfile",
          "NODE_OPTIONS=--max-old-space-size=2560 pnpm lint",
          "pnpm check-types",
          "pnpm test:coverage:core",
          "pnpm audit:dependencies",
          "pnpm scan:secrets",
          "pnpm cdk:synth",
        ],
        input: CodePipelineSource.connection(
          `${props.repository.owner}/${props.repository.name}`,
          props.repository.branch,
          {
            connectionArn: props.repository.connectionArn,
            triggerOnPush: true,
          },
        ),
        partialBuildSpec: BuildSpec.fromObject({
          phases: {
            install: {
              "runtime-versions": {
                nodejs: "26",
              },
            },
          },
        }),
        primaryOutputDirectory: "cdk/cdk.out",
      },
    );

    const pipelineName = "LandingPagePipeline";

    const landingPagePipeline = new CodePipeline(
      this,
      "LandingPagePipeline",
      {
        dockerEnabledForSynth: true,
        pipelineName: pipelineName,
        pipelineType: PipelineType.V2,
        synth: synth,
      },
    );

    landingPagePipeline.addStage(
      new LandingPageStage(
        this,
        "prod",
        {
          apiDomainName: props.environments.prod.apiDomainName,
          contactEmail: props.environments.prod.contactEmail,
          contactName: props.environments.prod.contactName,
          env: {
            account: Stack.of(this).account,
            region: Stack.of(this).region,
          },
          googleTagManagerId: props.environments.prod.googleTagManagerId,
          notificationRecipientEmail:
            props.environments.prod.notificationRecipientEmail,
          notificationSenderEmail:
            props.environments.prod.notificationSenderEmail,
          notificationSenderName:
            props.environments.prod.notificationSenderName,
          rootDomainName: props.environments.prod.rootDomainName,
          websiteDomainName: props.environments.prod.websiteDomainName,
        },
      ),
      { pre: [new ManualApprovalStep("ApproveProdDeployment")] },
    );
  }
}

export { LandingPagePipelineStack };
