import { describe, expect, it } from "vitest";

import { ContactMessageRequestSchema } from "./contactMessage";

const validRequest = {
  attachments: [],
  cooperation: "MVP",
  description: "Krótki opis projektu.",
  email: "test@example.com",
  nda: "",
  topic: "Nowy projekt",
};

describe(
  "ContactMessageRequestSchema",
  () => {
    it(
      "accepts a valid request",
      () => {
        expect(ContactMessageRequestSchema.safeParse(validRequest).success)
          .toBe(true);
      },
    );

    it(
      "accepts an omitted optional NDA field",
      () => {
        const requestWithoutNda = {
          attachments: [],
          cooperation: "MVP",
          description: "Krótki opis projektu.",
          email: "test@example.com",
          topic: "Nowy projekt",
        };

        expect(ContactMessageRequestSchema.safeParse(requestWithoutNda).success)
          .toBe(true);
      },
    );

    it(
      "rejects an invalid email",
      () => {
        const result = ContactMessageRequestSchema.safeParse({
          ...validRequest,
          email: "not-an-email",
        });

        expect(result.success)
          .toBe(false);
      },
    );

    it(
      "rejects a missing description",
      () => {
        const requestWithoutDescription = {
          attachments: [],
          cooperation: "MVP",
          email: "test@example.com",
          nda: "",
          topic: "Nowy projekt",
        };

        const parseResult = ContactMessageRequestSchema.safeParse(
          requestWithoutDescription,
        );

        expect(parseResult.success)
          .toBe(false);
      },
    );

    it(
      "rejects an unknown cooperation type",
      () => {
        const result = ContactMessageRequestSchema.safeParse({
          ...validRequest,
          cooperation: "UNKNOWN",
        });

        expect(result.success)
          .toBe(false);
      },
    );

    it(
      "rejects a topic longer than 100 characters",
      () => {
        const result = ContactMessageRequestSchema.safeParse({
          ...validRequest,
          topic: "a".repeat(101),
        });

        expect(result.success)
          .toBe(false);
      },
    );

    it(
      "rejects a description longer than 1000 characters",
      () => {
        const result = ContactMessageRequestSchema.safeParse({
          ...validRequest,
          description: "a".repeat(1001),
        });

        expect(result.success)
          .toBe(false);
      },
    );

    it(
      "accepts File instances in the attachments array",
      () => {
        const result = ContactMessageRequestSchema.safeParse({
          ...validRequest,
          attachments: [
            new File(
              ["content"],
              "cv.pdf",
              { type: "application/pdf" },
            ),
          ],
        });

        expect(result.success)
          .toBe(true);
      },
    );
  },
);
