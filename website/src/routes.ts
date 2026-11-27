import plPaths from "./i18n/pl/paths.json";

type Locale = "pl";

interface RouteDefinition {
  logicalPath: string
  namespaces: string[]
  paths: Record<Locale, string>
}

const SHARED_NAMESPACES = [
  "paths",
  "common",
  "navigation",
  "footer",
  "cookies",
];

const pageRoutes: RouteDefinition[] = [
  {
    logicalPath: "/",
    namespaces: [
      "home",
      "articles",
    ],
    paths: { pl: plPaths.home },
  },
  {
    logicalPath: "/404",
    namespaces: ["error"],
    paths: { pl: plPaths["404"] },
  },
  {
    logicalPath: "/about-me",
    namespaces: ["aboutMe"],
    paths: { pl: plPaths.aboutMe },
  },
  {
    logicalPath: "/blog",
    namespaces: [
      "blog",
      "articles",
    ],
    paths: { pl: plPaths.blog },
  },
  {
    logicalPath: "/contact",
    namespaces: ["contact"],
    paths: { pl: plPaths.contact },
  },
  {
    logicalPath: "/for-cto",
    namespaces: ["forCto"],
    paths: { pl: plPaths.forCto },
  },
  {
    logicalPath: "/for-founders",
    namespaces: ["forFounders"],
    paths: { pl: plPaths.forFounders },
  },
  {
    logicalPath: "/for-recruiters",
    namespaces: ["forRecruiters"],
    paths: { pl: plPaths.forRecruiters },
  },
  {
    logicalPath: "/offer",
    namespaces: ["offer"],
    paths: { pl: plPaths.offer },
  },
  {
    logicalPath: "/policies/cookies-policy",
    namespaces: ["cookiesPolicy"],
    paths: { pl: plPaths.cookiesPolicy },
  },
  {
    logicalPath: "/policies/privacy-policy",
    namespaces: ["privacyPolicy"],
    paths: { pl: plPaths.privacyPolicy },
  },
  {
    logicalPath: "/process",
    namespaces: ["process"],
    paths: { pl: plPaths.process },
  },
  {
    logicalPath: "/projects",
    namespaces: ["projects"],
    paths: { pl: plPaths.projects },
  },
  {
    logicalPath: "/stack",
    namespaces: ["stack"],
    paths: { pl: plPaths.stack },
  },
];

const articleRoutes: RouteDefinition[] = Object.entries(plPaths.articles)
  .map(([
    articleId,
    path,
  ]) => ({
    logicalPath: `/blog/${articleId}`,
    namespaces: [
      "blog",
      "articles",
    ],
    paths: { pl: path },
  }));

const routes: RouteDefinition[] = [
  ...pageRoutes,
  ...articleRoutes,
];

const getRouteByPathname = (pathname: string) => {
  return routes.find(route => Object.values(route.paths)
    .includes(pathname));
};

const getRouteByLogicalPath = (logicalPath: string) => {
  return routes.find(route => route.logicalPath === logicalPath);
};

const getLocalizedPath = (
  route: RouteDefinition,
  locale: Locale,
) => route.paths[locale];

const getPageNamespaces = (logicalPath: string): string[] => {
  return getRouteByLogicalPath(logicalPath)?.namespaces ?? ["error"];
};

const getAllNamespaces = (): string[] => {
  return [
    ...SHARED_NAMESPACES,
    ...new Set(
      routes.flatMap(route => route.namespaces),
    ),
  ];
};

export {
  getAllNamespaces,
  getLocalizedPath,
  getPageNamespaces,
  getRouteByLogicalPath,
  getRouteByPathname,
  type Locale,
  type RouteDefinition,
  routes,
  SHARED_NAMESPACES,
};
