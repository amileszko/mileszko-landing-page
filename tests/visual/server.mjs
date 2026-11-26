import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const root = path.resolve("website/dist/client");
const port = Number(process.env.VISUAL_TEST_PORT ?? 4173);

const contentTypes = new Map([
  [
    ".css",
    "text/css; charset=utf-8",
  ],
  [
    ".html",
    "text/html; charset=utf-8",
  ],
  [
    ".ico",
    "image/x-icon",
  ],
  [
    ".js",
    "text/javascript; charset=utf-8",
  ],
  [
    ".json",
    "application/json; charset=utf-8",
  ],
  [
    ".mp4",
    "video/mp4",
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
    ".svg",
    "image/svg+xml",
  ],
  [
    ".txt",
    "text/plain; charset=utf-8",
  ],
  [
    ".vtt",
    "text/vtt; charset=utf-8",
  ],
  [
    ".webmanifest",
    "application/manifest+json",
  ],
  [
    ".webp",
    "image/webp",
  ],
  [
    ".woff2",
    "font/woff2",
  ],
  [
    ".xml",
    "application/xml; charset=utf-8",
  ],
]);

function resolveFile(pathname) {
  let relative = decodeURIComponent(pathname);

  if (relative.includes("\0")) {
    return;
  }

  relative = path.normalize(relative)
    .replace(
      /^(\.\.(\/|\\|$))+/,
      "",
    );

  let candidate = path.join(
    root,
    relative,
  );

  if (!candidate.startsWith(root)) {
    return;
  }

  const isDirectory = fs.existsSync(candidate) &&
    fs.statSync(candidate)
      .isDirectory();

  if (isDirectory || !path.extname(candidate)) {
    candidate = path.join(
      candidate,
      "index.html",
    );
  }

  return fs.existsSync(candidate) ? candidate : undefined;
}

const server = http.createServer((request, response) => {
  const url = new URL(
    request.url ?? "/",
    `http://localhost:${port}`,
  );
  let file = resolveFile(url.pathname);
  let status = 200;

  if (!file) {
    file = path.join(
      root,
      "404.html",
    );
    status = 404;
  }

  if (!fs.existsSync(file)) {
    response.writeHead(
      404,
      { "content-type": "text/plain; charset=utf-8" },
    );
    response.end("Not found");
    return;
  }

  const extension = path.extname(file);
  response.writeHead(
    status,
    {
      "cache-control": "no-store",
      "content-type": contentTypes.get(extension) ?? "application/octet-stream",
    },
  );

  if (request.method === "HEAD") {
    response.end();
    return;
  }

  fs.createReadStream(file)
    .pipe(response);
});

server.listen(
  port,
  "127.0.0.1",
  () => {
    console.log(`visual test server: http://127.0.0.1:${port}`);
  },
);
