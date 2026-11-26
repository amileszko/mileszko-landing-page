import { expect, test } from "@playwright/test";

test(
  "contact form submits through the generated API client",
  async ({ page }) => {
    await page.route(
      "**/contact/messages",
      route => route.fulfill({
        body: JSON.stringify({ messageDelivered: true }),
        contentType: "application/json",
        status: 200,
      }),
    );

    await page.goto(
      "/kontakt",
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

    await page.getByLabel("Twój e-mail")
      .fill("test@example.com");
    await page.getByLabel("Temat/case")
      .fill("Testowy temat");
    await page.getByLabel("Opis problemu / celu")
      .fill("Testowy opis problemu.");
    await page.getByRole(
      "combobox",
      { name: "Wybierz model współpracy" },
    )
      .click();
    await page.getByRole(
      "option",
      { name: "MVP Sprint" },
    )
      .click();
    await page.getByRole(
      "button",
      { name: /Wyślij/ },
    )
      .click();

    await expect(page.getByText("Dzięki! Otrzymasz odpowiedź w 24 godziny"))
      .toBeVisible();
  },
);
