import { expect, test } from "@playwright/test";

test(
  "article content loads during client-side navigation",
  async ({ page }) => {
    await page.goto(
      "/blog",
      { waitUntil: "load" },
    );
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
      await page.waitForTimeout(400);
    }

    await page.locator('a[href*="/blog/5-pytan-ktore"]')
      .first()
      .click();

    await expect(page)
      .toHaveURL(/5-pytan-ktore-musisz-zadac/);
    await expect(page.locator("article"))
      .toContainText("Rachunek za AI");
  },
);
