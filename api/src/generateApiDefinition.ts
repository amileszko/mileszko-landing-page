import {
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import fs from "node:fs";
import openapiTS, {
  astToString,
  NULL,
  type SchemaObject,
  type TransformNodeOptions,
  type TransformObject,
} from "openapi-typescript";
import { factory, type TypeNode } from "typescript";

import {
  ContactMessageRequestSchema,
  ContactMessageResponseSchema,
} from "./definitions/contactMessage";

const registry = new OpenAPIRegistry();

const stringHeader = { schema: { type: "string" as const } };

const commonResponseHeaders = {
  "Access-Control-Allow-Headers": stringHeader,
  "Access-Control-Allow-Methods": stringHeader,
  "Access-Control-Allow-Origin": stringHeader,
  "Cache-Control": stringHeader,
  "Permissions-Policy": stringHeader,
  "Referrer-Policy": stringHeader,
  "Strict-Transport-Security": stringHeader,
  "Vary": stringHeader,
  "X-Content-Type-Options": stringHeader,
  "X-Frame-Options": stringHeader,
};

registry.registerPath(
  {
    method: "post",
    path: "/contact/messages",
    request: {
      body:
        {
          content:
            {
              "multipart/form-data":
                { schema: ContactMessageRequestSchema },
            },
        },
    },
    responses: {
      200: {
        content:
          {
            "application/json":
              { schema: ContactMessageResponseSchema },
          },
        description: "Message delivered.",
        headers: commonResponseHeaders,
      },
      400: {
        content: { "application/json": { schema: { type: "string" } } },
        description: "Bad request.",
        headers: commonResponseHeaders,
      },
      500: {
        content: { "application/json": { schema: { type: "string" } } },
        description: "Internal server error.",
        headers: commonResponseHeaders,
      },
    },
  },
);

registry.registerPath(
  {
    method: "options",
    path: "/contact/messages",
    responses: {
      204: {
        description: "CORS preflight response.",
        headers: commonResponseHeaders,
      },
    },
  },
);

const generator = new OpenApiGeneratorV3(registry.definitions);

const document = JSON.stringify(
  generator.generateDocument({
    info: {
      title: "Amadeusz Mileszko Landing Page Contact API",
      version: "1.0.0",
    },
    openapi: "3.0.0",
  }),
  undefined,
  2,
);

const FILE = factory.createTypeReferenceNode("File");
const BLOB = factory.createTypeReferenceNode("Blob");

const transformFileAndBlob = (
  schemaObject: SchemaObject,
  options: TransformNodeOptions,
): TransformObject | TypeNode | undefined => {
  if (schemaObject.format === "binary") {
    if (options.path?.includes("multipart~1form-data")) {
      return schemaObject.nullable ?
        factory.createUnionTypeNode([
          FILE,
          NULL,
        ]) :
        FILE;
    }

    if (options.path?.includes("application~1octet-stream")) {
      return schemaObject.nullable ?
        factory.createUnionTypeNode([
          BLOB,
          NULL,
        ]) :
        BLOB;
    }

    return undefined;
  }
};

const documentTypes = astToString(await openapiTS(
  document,
  { transform: transformFileAndBlob },
));

if (!fs.existsSync("dist")) {
  fs.mkdirSync(
    "dist",
    { recursive: true },
  );
}

fs.writeFileSync(
  "dist/api.json",
  document,
);

fs.writeFileSync(
  "dist/api.types.ts",
  documentTypes,
);
