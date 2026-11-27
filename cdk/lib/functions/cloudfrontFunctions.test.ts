import fs from "node:fs";
import vm from "node:vm";
import { describe, expect, it } from "vitest";

const loadFunction = (fileName: string) => {
  const context: Record<string, unknown> = {};

  vm.createContext(context);
  vm.runInContext(
    fs.readFileSync(
      new URL(
        fileName,
        import.meta.url,
      ),
      "utf8",
    ),
    context,
  );

  return context;
};

const urlEvent = (uri: string, host = "mileszko.pl") => ({
  request: {
    headers: { host: { value: host } },
    querystring: {},
    uri,
  },
});

describe(
  "CloudFront cache headers function",
  () => {
    const {handler} = loadFunction("./cache-headers-function.js") as {
      handler: (event: {
        request: { uri: string }
        response: { headers: Record<string, { value: string }> }
      }) => {
        headers: Record<string, { value: string }>
      }
    };

    const cacheControlFor = (uri: string) => handler({
      request: { uri },
      response: { headers: {} },
    }).headers["cache-control"].value;

    it(
      "disables browser caching for HTML and extensionless routes",
      () => {
        expect(cacheControlFor("/"))
          .toBe("no-cache");
        expect(cacheControlFor("/kontakt"))
          .toBe("no-cache");
        expect(cacheControlFor("/404.html"))
          .toBe("no-cache");
      },
    );

    it(
      "uses immutable caching for hashed assets",
      () => {
        expect(cacheControlFor("/assets/app.js"))
          .toBe("public, max-age=31536000, immutable");
      },
    );

    it(
      "uses explicit font and media policies",
      () => {
        expect(cacheControlFor("/fonts/inter-normal-latin.woff2"))
          .toBe("public, max-age=2592000");
        expect(cacheControlFor("/intro.mp4"))
          .toBe("public, max-age=604800");
      },
    );

    it(
      "sets image content types",
      () => {
        const response = handler({
          request: { uri: "/avatar.webp" },
          response: { headers: {} },
        });

        expect(response.headers["content-type"].value)
          .toBe("image/webp");
      },
    );

    it(
      "uses a short cache for sitemap and robots",
      () => {
        expect(cacheControlFor("/sitemap.xml"))
          .toBe("public, max-age=3600");
        expect(cacheControlFor("/robots.txt"))
          .toBe("public, max-age=3600");
      },
    );
  },
);

describe(
  "CloudFront URL normalization function",
  () => {
    const {handler} = loadFunction("./url-normalization-function.js") as {
      handler: (event: {
        request: {
          headers: { host: { value: string } }
          querystring: Record<string, unknown>
          uri: string
        }
      }) => {
        headers?: { location?: { value: string } }
        statusCode?: number
        uri?: string
      }
    };

    it(
      "normalizes directory-style paths and strips www",
      () => {
        const response = handler(urlEvent(
          "/Kontakt/",
          "www.mileszko.pl",
        ));

        expect(response.statusCode)
          .toBe(301);
        expect(response.headers?.location?.value)
          .toBe("https://mileszko.pl/kontakt");
      },
    );

    it(
      "rewrites extensionless routes to index.html",
      () => {
        expect(handler(urlEvent("/kontakt")).uri)
          .toBe("/kontakt/index.html");
      },
    );

    it(
      "leaves the root and static files unchanged",
      () => {
        expect(handler(urlEvent("/")).uri)
          .toBe("/");
        expect(handler(urlEvent("/intro.mp4")).uri)
          .toBe("/intro.mp4");
      },
    );
  },
);
