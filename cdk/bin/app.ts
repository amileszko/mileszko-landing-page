import { App } from "aws-cdk-lib";

import { config } from "../config/config";
import {
  LandingPagePipelineStack,
} from "../lib/pipeline/LandingPagePipelineStack";

const app = new App();

new LandingPagePipelineStack(
  app,
  "LandingPagePipeline",
  {
    environments: config.environments,
    githubToken: config.githubToken,
    repository: config.repository,
  },
);

app.synth();
