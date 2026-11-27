import path from "node:path";

import {
  MAX_ATTACHMENT_SIZE,
  MAX_ATTACHMENT_SIZE_MB,
  MAX_FILENAME_LENGTH,
} from "../constants/contact";

const allowedExtensions = new Map([
  [
    ".doc",
    "application/msword",
  ],
  [
    ".docx",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  [
    ".gif",
    "image/gif",
  ],
  [
    ".jpeg",
    "image/jpeg",
  ],
  [
    ".jpg",
    "image/jpeg",
  ],
  [
    ".md",
    "text/markdown",
  ],
  [
    ".pdf",
    "application/pdf",
  ],
  [
    ".png",
    "image/png",
  ],
  [
    ".txt",
    "text/plain",
  ],
  [
    ".webp",
    "image/webp",
  ],
]);

class AttachmentValidationError extends Error {}

const sanitizeFilename = (
  filename: string,
  fallback = "attachment",
): string => {
  const baseName = filename
    .replaceAll(
      "\\",
      "/",
    )
    .split("/")
    .at(-1) ?? "";
  const extension = path.extname(baseName)
    .toLowerCase();
  const stem = path.basename(
    baseName,
    path.extname(baseName),
  )
    .replaceAll(
      /\p{Cc}/gu,
      "",
    )
    .replaceAll(
      /[<>:"/\\|?*]/g,
      "_",
    )
    .replaceAll(
      /\s+/g,
      " ",
    )
    .trim()
    .replaceAll(
      /[. ]+$/g,
      "",
    )
    .slice(
      0,
      MAX_FILENAME_LENGTH,
    );

  return `${stem || fallback}${extension}`;
};

const getExtension = (filename: string): string => path.extname(
  filename.replaceAll(
    "\\",
    "/",
  ),
)
  .toLowerCase();

const assertMagicBytes = (
  buffer: Buffer,
  extension: string,
): void => {
  const ascii = buffer.toString(
    "ascii",
    0,
    12,
  );

  if (extension === ".md" || extension === ".txt") {
    if (buffer.includes(0)) {
      throw new AttachmentValidationError("Text attachments must be UTF-8 text.");
    }

    return;
  }

  switch (extension) {
    case ".doc": {
      const signature = buffer.subarray(
        0,
        8,
      )
        .toString("hex");
      if (signature !== "d0cf11e0a1b11ae1") {
        throw new AttachmentValidationError("Invalid DOC file.");
      }
      break;
    }

    case ".docx": {
      if (!ascii.startsWith("PK\u{3}\u{4}")) {
        throw new AttachmentValidationError("Invalid DOCX file.");
      }
      break;
    }

    case ".gif": {
      if (!ascii.startsWith("GIF87a") && !ascii.startsWith("GIF89a")) {
        throw new AttachmentValidationError("Invalid GIF file.");
      }
      break;
    }

    case ".jpeg":
    case ".jpg": {
      if (
        buffer[0] !== 0xFF ||
        buffer[1] !== 0xD8 ||
        buffer[2] !== 0xFF
      ) {
        throw new AttachmentValidationError("Invalid JPEG file.");
      }
      break;
    }

    case ".pdf": {
      if (!ascii.startsWith("%PDF-")) {
        throw new AttachmentValidationError("Invalid PDF file.");
      }
      break;
    }

    case ".png": {
      const signature = buffer.subarray(
        0,
        8,
      )
        .toString("hex");
      if (signature !== "89504e470d0a1a0a") {
        throw new AttachmentValidationError("Invalid PNG file.");
      }
      break;
    }
    case ".webp": {
      if (
        !ascii.startsWith("RIFF") ||
        buffer.subarray(
          8,
          12,
        )
          .toString("ascii") !== "WEBP"
      ) {
        throw new AttachmentValidationError("Invalid WebP file.");
      }
      break;
    }

    default: {
      throw new AttachmentValidationError("Unsupported attachment type.");
    }
  }
};

const validateAttachment = async (file: File) => {
  if (file.size === 0) {
    throw new AttachmentValidationError("Empty attachments are not allowed.");
  }

  if (file.size > MAX_ATTACHMENT_SIZE) {
    throw new AttachmentValidationError(
      `Attachments must be ${MAX_ATTACHMENT_SIZE_MB} MB or smaller.`,
    );
  }

  const filename = sanitizeFilename(file.name);
  const extension = getExtension(filename);
  const contentType = allowedExtensions.get(extension);

  if (!contentType) {
    throw new AttachmentValidationError("Unsupported attachment type.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  assertMagicBytes(
    buffer,
    extension,
  );

  return {
    buffer,
    contentType,
    filename,
  };
};

export {
  AttachmentValidationError,
  sanitizeFilename,
  validateAttachment,
};
