import { expect, test } from "@playwright/test";

import { publicRoutes, routeSlug } from "./routes";

test(
  "all public routes match the visual baseline",
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

    let consentHandled = false;

    for (const route of publicRoutes()) {
      const response = await page.goto(
        route,
        { waitUntil: "load" },
      );

      expect(response?.status())
        .toBe(200);
      await page.evaluate(() => document.fonts.ready);

      if (!consentHandled) {
        await page.waitForTimeout(1200);
        const accept = page.getByRole(
          "button",
          { name: "Zaakceptuj wszystkie" },
        );

        let isVisible: boolean;

        try {
          isVisible = await accept.isVisible();
        }
        catch {
          isVisible = false;
        }

        if (isVisible) {
          await accept.click();
          await page.waitForTimeout(600);
        }

        consentHandled = true;
      }

      await page.waitForTimeout(350);

      await expect(page)
        .toHaveScreenshot(
          `${routeSlug(route)}.png`,
          {
            animations: "disabled",
            fullPage: true,
          },
        );
    }
  },
);
