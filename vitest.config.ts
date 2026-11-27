import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      include: [
        "api/src/constants/contact.ts",
        "api/src/definitions/contactMessage.ts",
        "api/src/utils/emailTemplatesService.ts",
        "api/src/utils/fileValidation.ts",
        "website/src/routes.ts",
      ],
      provider: "v8",
      reporter: [
        "text",
        "lcov",
      ],
      reportsDirectory: "coverage/core",
      thresholds: {
        branches: 45,
        functions: 60,
        lines: 60,
        statements: 60,
      },
    },
    environment: "node",
    include: [
      "api/src/**/*.test.ts",
      "cdk/lib/functions/**/*.test.ts",
      "tests/**/*.test.ts",
      "website/src/**/*.test.ts",
    ],
  },
});
