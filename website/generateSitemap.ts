import { config as dotenvConfig } from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { generateSitemap } from "sitemap-ts";

dotenvConfig();

const hostName = process.env.HOST_NAME;

if (!hostName) {
  throw new Error("Missing environment variable: HOST_NAME");
}

await generateSitemap({
  exclude: ["/404"],
  hostname: `${hostName}/`,
  outDir: "dist/client",
});

const indexPath = path.join(
  "dist/client",
  "index.html",
);

let html = fs.readFileSync(
  indexPath,
  "utf8",
);

html = html.replace(
  "</head>",
  "<link rel=\"sitemap\" type=\"application/xml\" href=\"/sitemap.xml\" />\n</head>",
);

fs.writeFileSync(
  indexPath,
  html,
);
