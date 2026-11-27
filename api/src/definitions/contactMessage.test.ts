import { describe, expect, it } from "vitest";

import {
  MAX_ATTACHMENTS,
  MAX_DESCRIPTION_LENGTH,
  MAX_EMAIL_LENGTH,
  MAX_TOPIC_LENGTH,
} from "../constants/contact";
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
      `rejects a topic longer than ${MAX_TOPIC_LENGTH} characters`,
      () => {
        const result = ContactMessageRequestSchema.safeParse({
          ...validRequest,
          topic: "a".repeat(MAX_TOPIC_LENGTH + 1),
        });

        expect(result.success)
          .toBe(false);
      },
    );

    it(
      `rejects a description longer than ${MAX_DESCRIPTION_LENGTH} characters`,
      () => {
        const result = ContactMessageRequestSchema.safeParse({
          ...validRequest,
          description: "a".repeat(MAX_DESCRIPTION_LENGTH + 1),
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

    it(
      `rejects more than ${MAX_ATTACHMENTS} attachments`,
      () => {
        const attachment = new File(
          ["content"],
          "cv.pdf",
          { type: "application/pdf" },
        );
        const result = ContactMessageRequestSchema.safeParse({
          ...validRequest,
          attachments: Array.from(
            { length: MAX_ATTACHMENTS + 1 },
            () => attachment,
          ),
        });

        expect(result.success)
          .toBe(false);
      },
    );

    it(
      `rejects an email longer than ${MAX_EMAIL_LENGTH} characters`,
      () => {
        const result = ContactMessageRequestSchema.safeParse({
          ...validRequest,
          email: `${"a".repeat(MAX_EMAIL_LENGTH - 11)}@example.com`,
        });

        expect(result.success)
          .toBe(false);
      },
    );
  },
);
