import { expect, test } from "@playwright/test";

const emailRoutes = [
  "/emails/contact-message-delivered",
  "/emails/contact-message-notification",
];

test(
  "email templates match the visual baseline",
  async ({ page }) => {
    for (const route of emailRoutes) {
      const response = await page.goto(
        route,
        { waitUntil: "load" },
      );

      expect(response?.status())
        .toBe(200);
      await page.evaluate(() => document.fonts.ready);

      await expect(page)
        .toHaveScreenshot(
          `${route.split("/")
            .pop()}.png`,
          {
            animations: "disabled",
            fullPage: true,
          },
        );
    }
  },
);
