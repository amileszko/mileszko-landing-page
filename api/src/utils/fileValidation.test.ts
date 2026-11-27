import { describe, expect, it } from "vitest";

import { MAX_ATTACHMENT_SIZE } from "../constants/contact";
import {
  AttachmentValidationError,
  sanitizeFilename,
  validateAttachment,
} from "./fileValidation";

const pdfBytes = new TextEncoder()
  .encode("%PDF-1.4\n%%EOF\n");

const pdfFile = (name = "document.pdf"): File => new File(
  [pdfBytes],
  name,
  { type: "application/pdf" },
);

describe(
  "fileValidation",
  () => {
    it(
      "accepts a valid PDF",
      async () => {
        const result = await validateAttachment(pdfFile());

        expect(result.filename)
          .toBe("document.pdf");
        expect(result.contentType)
          .toBe("application/pdf");
        expect(result.buffer.length)
          .toBe(pdfBytes.length);
      },
    );

    it(
      "sanitizes path and control characters in filenames",
      () => {
        expect(sanitizeFilename("../../evil\r\nname.pdf"))
          .toBe("evilname.pdf");
      },
    );

    it(
      "rejects an executable extension",
      async () => {
        await expect(validateAttachment(pdfFile("payload.exe")))
          .rejects
          .toBeInstanceOf(AttachmentValidationError);
      },
    );

    it(
      "rejects an SVG",
      async () => {
        await expect(validateAttachment(pdfFile("image.svg")))
          .rejects
          .toBeInstanceOf(AttachmentValidationError);
      },
    );

    it(
      "rejects a double extension",
      async () => {
        await expect(validateAttachment(pdfFile("invoice.pdf.exe")))
          .rejects
          .toBeInstanceOf(AttachmentValidationError);
      },
    );

    it(
      "rejects a file whose contents do not match its extension",
      async () => {
        const fakePdf = new File(
          ["not a pdf"],
          "fake.pdf",
          { type: "application/pdf" },
        );

        await expect(validateAttachment(fakePdf))
          .rejects
          .toBeInstanceOf(AttachmentValidationError);
      },
    );

    it(
      "rejects an oversized file",
      async () => {
        const oversized = new File(
          [new Uint8Array(MAX_ATTACHMENT_SIZE + 1)],
          "large.pdf",
          { type: "application/pdf" },
        );

        await expect(validateAttachment(oversized))
          .rejects
          .toBeInstanceOf(AttachmentValidationError);
      },
    );

    it(
      "accepts a valid PNG signature",
      async () => {
        const pngBytes = new Uint8Array([
          0x89,
          0x50,
          0x4E,
          0x47,
          0x0D,
          0x0A,
          0x1A,
          0x0A,
        ]);
        const png = new File(
          [pngBytes],
          "image.png",
          { type: "image/png" },
        );

        await expect(validateAttachment(png))
          .resolves
          .toMatchObject({
            contentType: "image/png",
            filename: "image.png",
          });
      },
    );
  },
);
