import { describe, expect, it } from "vitest";

import { emailTemplatesService } from "./emailTemplatesService";

describe(
  "emailTemplatesService",
  () => {
    it(
      "replaces known template variables",
      () => {
        const template = "<p>{{ topic }}</p><p>{{ email }}</p>";

        expect(emailTemplatesService.replaceTemplateVariables(
          template,
          {
            email: "test@example.com",
            topic: "Nowy projekt",
          },
        ))
          .toBe("<p>Nowy projekt</p><p>test@example.com</p>");
      },
    );

    it(
      "escapes HTML values in HTML mode",
      () => {
        const template = "<p>{{ topic }}</p>";

        expect(emailTemplatesService.replaceTemplateVariables(
          template,
          { topic: '<img src=x onerror="alert(1)">' },
          "html",
        ))
          .toBe("<p>&lt;img src=x onerror=&quot;alert(1)&quot;&gt;</p>");
      },
    );

    it(
      "does not expand replacement patterns",
      () => {
        const template = "A{{ topic }}B";

        expect(emailTemplatesService.replaceTemplateVariables(
          template,
          { topic: "$` $& $' $1" },
          "html",
        ))
          .toBe("A$` $&amp; $&#39; $1B");
      },
    );

    it(
      "normalizes line endings in text mode",
      () => {
        expect(emailTemplatesService.replaceTemplateVariables(
          "{{ description }}",
          { description: "line one\r\nline two\rline three" },
          "text",
        ))
          .toBe("line one\nline two\nline three");
      },
    );

    it(
      "leaves unknown placeholders untouched",
      () => {
        expect(emailTemplatesService.replaceTemplateVariables(
          "<p>{{ topic }}</p>{{ unknown }}",
          { topic: "Nowy projekt" },
        ))
          .toBe("<p>Nowy projekt</p>{{ unknown }}");
      },
    );

    it(
      "extracts the subject from the template title",
      () => {
        expect(emailTemplatesService.getSubjectFromTemplate(
          "<html><head><title>Nowa wiadomość</title></head></html>",
        ))
          .toBe("Nowa wiadomość");
      },
    );

    it(
      "returns an empty subject when no title exists",
      () => {
        expect(emailTemplatesService.getSubjectFromTemplate("<p>Brak tytułu</p>"))
          .toBe("");
      },
    );
  },
);
