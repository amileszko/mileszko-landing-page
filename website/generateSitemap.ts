import { config as dotenvConfig } from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { generateSitemap } from "sitemap-ts";

dotenvConfig();

generateSitemap({
  exclude: ["/404"],
  hostname: `${process.env.HOST_NAME ?? "https://localhost:3000"}/`,
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
