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
    env: {
      account: config.environments.prod.account,
      region: config.environments.prod.region,
    },
    environments: config.environments,
    repository: config.repository,
  },
);

app.synth();
