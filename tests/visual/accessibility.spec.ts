import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { publicRoutes } from "./routes";

const wcagTags = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22aa",
];

const summarizeViolations = (results: Awaited<ReturnType<AxeBuilder["analyze"]>>) => results.violations.map(
  violation => ({
    help: violation.help,
    id: violation.id,
    impact: violation.impact,
    nodes: violation.nodes.map(node => node.target),
  }),
);

test(
  "public routes have no accessibility violations",
  async ({ page }) => {
    await page.route(
      "**://www.googletagmanager.com/**",
      route => route.abort(),
    );
    await page.route(
      "**://www.google-analytics.com/**",
      route => route.abort(),
    );
    await page.route(
      "**://region1.google-analytics.com/**",
      route => route.abort(),
    );

    const failures: {
      route: string
      violations: ReturnType<typeof summarizeViolations>
    }[] = [];

    const scan = async (route: string) => {
      const response = await page.goto(
        route,
        { waitUntil: "load" },
      );

      expect(response?.status())
        .toBe(200);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(350);

      const results = await new AxeBuilder({ page })
        .withTags(wcagTags)
        .analyze();
      const violations = summarizeViolations(results);

      if (violations.length > 0) {
        failures.push({
          route,
          violations,
        });
      }
    };

    await scan("/");

    const accept = page.getByRole(
      "button",
      { name: "Zaakceptuj wszystkie" },
    );

    if (await accept.isVisible()) {
      await accept.click();
      await page.waitForTimeout(400);
    }

    for (const route of publicRoutes()) {
      if (route !== "/") {
        await scan(route);
      }
    }

    expect(
      failures,
      JSON.stringify(
        failures,
        undefined,
        2,
      ),
    )
      .toEqual([]);
  },
);
