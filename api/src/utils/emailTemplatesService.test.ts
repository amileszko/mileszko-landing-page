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
