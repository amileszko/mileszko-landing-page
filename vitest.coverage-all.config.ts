import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        "**/*.d.ts",
        "**/*.test.ts",
        "**/coverage/**",
        "**/dist/**",
        "**/node_modules/**",
      ],
      include: [
        "api/src/**/*.ts",
        "cdk/config/**/*.ts",
        "cdk/lib/**/*.ts",
        "website/src/**/*.{ts,tsx}",
      ],
      provider: "v8",
      reporter: [
        "text",
        "html",
        "lcov",
      ],
      reportsDirectory: "coverage/all",
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
