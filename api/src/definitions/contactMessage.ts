import * as z from "zod";

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
    })),
  cooperation: z.enum(
    CooperationType,
    "Cooperation type is required.",
  ),
  description: z
    .string()
    .nonempty("Description is required.")
    .max(
      1000,
      "Description is too long.",
    ),
  email: z
    .email("Invalid email format.")
    .nonempty("Email is required.")
    .max(
      50,
      "Email is too long.",
    ),
  nda: z.string()
    .max(
      1000,
      "NDA is too long.",
    )
    .optional(),
  topic: z
    .string()
    .nonempty("Topic is required.")
    .max(
      100,
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
