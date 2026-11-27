import * as z from "zod";

import {
  MAX_ATTACHMENTS,
  MAX_DESCRIPTION_LENGTH,
  MAX_EMAIL_LENGTH,
  MAX_NDA_LENGTH,
  MAX_TOPIC_LENGTH,
} from "../constants/contact";

enum CooperationType {
  AUDIT = "AUDIT",
  MENTORING = "MENTORING",
  MVP = "MVP",
  OTHER = "OTHER",
  REFACTORING = "REFACTORING",
}

const ContactMessageRequestSchema = z.object({
  attachments: z.array(z.instanceof(File)
    .meta({
      format: "binary",
      type: "string",
    }))
    .max(
      MAX_ATTACHMENTS,
      `Maximum ${MAX_ATTACHMENTS} files allowed.`,
    ),
  cooperation: z.enum(
    CooperationType,
    "Cooperation type is required.",
  ),
  description: z
    .string()
    .nonempty("Description is required.")
    .max(
      MAX_DESCRIPTION_LENGTH,
      "Description is too long.",
    ),
  email: z
    .email("Invalid email format.")
    .nonempty("Email is required.")
    .max(
      MAX_EMAIL_LENGTH,
      "Email is too long.",
    ),
  nda: z.string()
    .max(
      MAX_NDA_LENGTH,
      "NDA is too long.",
    )
    .optional(),
  topic: z
    .string()
    .nonempty("Topic is required.")
    .max(
      MAX_TOPIC_LENGTH,
      "Topic is too long.",
    ),
});

type ContactMessageRequest = z.infer<typeof ContactMessageRequestSchema>;

const ContactMessageResponseSchema = z
  .object({ messageDelivered: z.boolean() });

interface ContactMessagePayload {
  attachmentsKeys: string[]
  cooperation: string
  description: string
  email: string
  messageId: string
  nda?: string
  topic: string
}

type ContactMessageResponse = z.infer<typeof ContactMessageResponseSchema>;

export { ContactMessageRequestSchema, ContactMessageResponseSchema };

export type { ContactMessagePayload,
  ContactMessageRequest,
  ContactMessageResponse };
