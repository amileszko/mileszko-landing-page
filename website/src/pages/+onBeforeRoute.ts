import { modifyUrl } from "vike/modifyUrl";
import { type Url } from "vike/types";

import i18next from "../i18n/config";

const onBeforeRoute = (pageContext: { urlParsed: Url }) => {
  const pathsMap = {
    "/": {
      pl: i18next.t(
        "paths:home",
        { lng: "pl" },
      ),
    },
    "/about-me": {
      pl: i18next.t(
        "paths:aboutMe",
        { lng: "pl" },
      ),
    },
    "/blog": {
      pl: i18next.t(
        "paths:blog",
        { lng: "pl" },
      ),
    },
    "/contact": {
      pl: i18next.t(
        "paths:contact",
        { lng: "pl" },
      ),
    },
    "/for-cto": {
      pl: i18next.t(
        "paths:forCto",
        { lng: "pl" },
      ),
    },
    "/for-founders": {
      pl: i18next.t(
        "paths:forFounders",
        { lng: "pl" },
      ),
    },
    "/for-recruiters": {
      pl: i18next.t(
        "paths:forRecruiters",
        { lng: "pl" },
      ),
    },
    "/offer": {
      pl: i18next.t(
        "paths:offer",
        { lng: "pl" },
      ),
    },
    "/policies/cookies-policy": {
      pl: i18next.t(
        "paths:cookiesPolicy",
        { lng: "pl" },
      ),
    },
    "/policies/privacy-policy": {
      pl: i18next.t(
        "paths:privacyPolicy",
        { lng: "pl" },
      ),
    },
    "/process": {
      pl: i18next.t(
        "paths:process",
        { lng: "pl" },
      ),
    },
    "/projects": {
      pl: i18next.t(
        "paths:projects",
        { lng: "pl" },
      ),
    },
    "/stack": {
      pl: i18next.t(
        "paths:stack",
        { lng: "pl" },
      ),
    },
    ...(() => {
      const articles = i18next.t(
        "paths:articles",
        {
          lng: "pl",
          returnObjects: true,
        },
      ) as Record<string, string>;
      const articlesMap: Record<string, Record<string, string>> = {};

      for (const [
        key,
        path,
      ] of Object.entries(articles)) {
        articlesMap[`/blog/${key}`] = { pl: path };
      }

      return articlesMap;
    })(),
  };

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
  pathsMap: Record<string, Record<string, string>>,
) => {
  const { pathname } = url;

  const locale =
    locales.find(locale => pathname.startsWith(`/${locale}`)) ??
    defaultLocale;

  let pathnameWithoutLocale = pathname;

  for (const [
    logicalPath,
    translations,
  ] of Object.entries(pathsMap)) {
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
