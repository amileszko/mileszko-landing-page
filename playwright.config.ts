import { defineConfig } from "@playwright/test";

export default defineConfig({
  expect: {
    timeout: 15_000,
    toHaveScreenshot: { maxDiffPixelRatio: 0.01 },
  },
  fullyParallel: false,
  projects: [
    {
      name: "desktop",
      use: {
        viewport: {
          height: 900,
          width: 1440,
        },
      },
    },
    {
      name: "mobile",
      use: {
        viewport: {
          height: 844,
          width: 390,
        },
      },
    },
  ],
  reporter: [["list"]],
  snapshotPathTemplate:
    "{testDir}/__screenshots__/{projectName}/{arg}{ext}",
  testDir: "./tests/visual",
  timeout: 180_000,
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node tests/visual/server.mjs",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
    url: "http://127.0.0.1:4173",
  },
  workers: 1,
});
