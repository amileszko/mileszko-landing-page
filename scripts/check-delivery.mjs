const baseUrl = process.env.BASE_URL ?? "https://mileszko.pl";
const failures = [];

const fetchPath = async (requestPath) => {
  const response = await fetch(
    new URL(
      requestPath,
      baseUrl,
    ),
    { signal: AbortSignal.timeout(15_000) },
  );

  if (!response.ok) {
    throw new Error(`${requestPath}: HTTP ${response.status}`);
  }

  return response;
};

const checkHeader = (
  label,
  headers,
  name,
  expected,
) => {
  const value = headers.get(name) ?? "";

  if (!value.includes(expected)) {
    failures.push(`${label}: ${name}="${value}" does not include "${expected}"`);
  }
};

const home = await fetchPath("/");
const html = await home.text();
const assetMatch = html.match(
  /(?:src|href)="(\/assets\/[^"]+\.(?:js|css))"/,
);
const assetPath = assetMatch?.[1];

checkHeader(
  "/",
  home.headers,
  "cache-control",
  "no-cache",
);
checkHeader(
  "/",
  home.headers,
  "content-type",
  "text/html",
);

for (const forbidden of [
  "www.googletagmanager.com/gtm.js",
  "fonts.gstatic.com",
]) {
  if (html.includes(forbidden)) {
    failures.push(`/: HTML still contains ${forbidden}`);
  }
}

if (assetPath) {
  const asset = await fetchPath(assetPath);

  checkHeader(
    assetPath,
    asset.headers,
    "cache-control",
    "max-age=31536000",
  );
  checkHeader(
    assetPath,
    asset.headers,
    "cache-control",
    "immutable",
  );
}
else {
  failures.push("/: could not find a hashed asset URL");
}

const font = await fetchPath("/fonts/inter-normal-latin.woff2");

checkHeader(
  "/fonts/inter-normal-latin.woff2",
  font.headers,
  "cache-control",
  "max-age=2592000",
);
checkHeader(
  "/fonts/inter-normal-latin.woff2",
  font.headers,
  "content-type",
  "font/woff2",
);

const image = await fetchPath("/avatar.webp");

checkHeader(
  "/avatar.webp",
  image.headers,
  "cache-control",
  "max-age=604800",
);
checkHeader(
  "/avatar.webp",
  image.headers,
  "content-type",
  "image/webp",
);

const video = await fetchPath("/intro.mp4");

checkHeader(
  "/intro.mp4",
  video.headers,
  "accept-ranges",
  "bytes",
);
checkHeader(
  "/intro.mp4",
  video.headers,
  "cache-control",
  "max-age=604800",
);

const videoSize = Number(video.headers.get("content-length") ?? 0);

if (videoSize > 7 * 1024 * 1024) {
  failures.push(`/intro.mp4: ${videoSize} bytes exceeds the 7 MB budget`);
}

const sitemap = await fetchPath("/sitemap.xml");

checkHeader(
  "/sitemap.xml",
  sitemap.headers,
  "cache-control",
  "max-age=3600",
);

if (failures.length > 0) {
  console.error("Delivery checks failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`delivery checks: ${baseUrl}`);
process.exit(0);
