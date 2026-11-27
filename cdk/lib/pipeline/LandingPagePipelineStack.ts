import { SecretValue, Stack, type StackProps } from "aws-cdk-lib";
import { PipelineType } from "aws-cdk-lib/aws-codepipeline";
import {
  CodeBuildStep,
  CodePipeline,
  CodePipelineSource,
  ManualApprovalStep,
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
      {
        ...props,
        terminationProtection: true,
      },
    );

    const synth = new CodeBuildStep(
      "Synth",
      {
        commands: [
          "cp .yarn/releases/yarn-4.19.0.cjs /usr/local/bin/yarn",
          "chmod +x /usr/local/bin/yarn",
          "yarn --version",
          "yarn workspaces focus @mileszko-landing-page/monorepo @mileszko-landing-page/website @mileszko-landing-page/api @mileszko-landing-page/cdk",
          "git diff --exit-code -- yarn.lock",
          "yarn lint",
          "yarn check-types",
          "yarn test:coverage:core",
          "yarn audit:dependencies",
          "yarn scan:secrets",
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
