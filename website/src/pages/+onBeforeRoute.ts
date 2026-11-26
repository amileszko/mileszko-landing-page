import { modifyUrl } from "vike/modifyUrl";
import { type Url } from "vike/types";

import plPaths from "../i18n/pl/paths.json";

const articlePaths: Record<string, Record<string, string>> = Object.fromEntries(
  Object.entries(plPaths.articles)
    .map(([
      articleId,
      path,
    ]) => [
      `/blog/${articleId}`,
      { pl: path },
    ]),
);

const pathsMap: Record<string, Record<string, string>> = {
  "/": { pl: plPaths.home },
  "/about-me": { pl: plPaths.aboutMe },
  "/blog": { pl: plPaths.blog },
  "/contact": { pl: plPaths.contact },
  "/for-cto": { pl: plPaths.forCto },
  "/for-founders": { pl: plPaths.forFounders },
  "/for-recruiters": { pl: plPaths.forRecruiters },
  "/offer": { pl: plPaths.offer },
  "/policies/cookies-policy": { pl: plPaths.cookiesPolicy },
  "/policies/privacy-policy": { pl: plPaths.privacyPolicy },
  "/process": { pl: plPaths.process },
  "/projects": { pl: plPaths.projects },
  "/stack": { pl: plPaths.stack },
  ...articlePaths,
};

const onBeforeRoute = (pageContext: { urlParsed: Url }) => {
  const { locale, urlWithoutLocale } = extractLocale(
    pageContext.urlParsed,
    pathsMap,
  );

  return {
    pageContext: {
      locale: locale,
      urlLogical: urlWithoutLocale,
    },
  };
};

const defaultLocale = "pl";
const locales = [
  "en",
  "pl",
];

const extractLocale = (
  url: Url,
  routes: Record<string, Record<string, string>>,
) => {
  const { pathname } = url;

  const locale =
    locales.find(locale => pathname.startsWith(`/${locale}`)) ??
    defaultLocale;

  let pathnameWithoutLocale = pathname;

  for (const [
    logicalPath,
    translations,
  ] of Object.entries(routes)) {
    if (translations[locale] === pathname) {
      pathnameWithoutLocale = logicalPath;
      break;
    }
  }

  const urlWithoutLocale = modifyUrl(
    url.href,
    { pathname: pathnameWithoutLocale },
  );

  return {
    locale,
    urlWithoutLocale,
  };
};

export { onBeforeRoute };
