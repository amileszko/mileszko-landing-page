import { describe, expect, it } from "vitest";

import plPaths from "./i18n/pl/paths.json";
import {
  getAllNamespaces,
  getLocalizedPath,
  getPageNamespaces,
  getRouteByLogicalPath,
  getRouteByPathname,
  routes,
  SHARED_NAMESPACES,
} from "./routes";

describe(
  "route configuration",
  () => {
    it(
      "has a unique Polish path and namespaces for every route",
      () => {
        const paths = routes.map(route => getLocalizedPath(
          route,
          "pl",
        ));

        expect(new Set(paths).size)
          .toBe(paths.length);
        expect(routes.every(route => route.namespaces.length > 0))
          .toBe(true);
      },
    );

    it(
      "resolves localized paths to their logical routes",
      () => {
        expect(getRouteByPathname("/")?.logicalPath)
          .toBe("/");
        expect(getRouteByPathname("/o-mnie")?.logicalPath)
          .toBe("/about-me");
        expect(getRouteByPathname(plPaths.articles["7-25-08-2025"])?.logicalPath)
          .toBe("/blog/7-25-08-2025");
      },
    );

    it(
      "resolves all article routes from paths.json",
      () => {
        const articleRoutes = routes.filter(route =>
          route.logicalPath.startsWith("/blog/"));

        expect(articleRoutes)
          .toHaveLength(Object.keys(plPaths.articles).length);
      },
    );

    it(
      "returns the route-specific namespace set",
      () => {
        expect(getPageNamespaces("/"))
          .toEqual([
            "home",
            "articles",
          ]);
        expect(getPageNamespaces("/blog/7-25-08-2025"))
          .toEqual([
            "blog",
            "articles",
          ]);
        expect(getPageNamespaces("/missing"))
          .toEqual(["error"]);
      },
    );

    it(
      "includes shared and page namespaces for server initialization",
      () => {
        const namespaces = getAllNamespaces();

        expect(namespaces)
          .toEqual(expect.arrayContaining(SHARED_NAMESPACES));
        expect(namespaces)
          .toEqual(expect.arrayContaining([
            "home",
            "articles",
            "contact",
            "error",
          ]));
      },
    );

    it(
      "returns the logical route for prerendering",
      () => {
        expect(getRouteByLogicalPath("/process")?.paths.pl)
          .toBe(plPaths.process);
      },
    );
  },
);
