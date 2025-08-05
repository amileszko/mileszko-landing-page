import { type PageContext } from "vike/types";

import i18next, { initI18next } from "../i18n/config";

const locales = [
  "pl",
  "en",
];

const onPrerenderStart = async (prerenderContext: {
  pageContexts: PageContext[]
}) => {
  await initI18next();

  const pathsMap: Record<string, Record<string, string>> = {
    "/": {
      pl: i18next.t(
        "paths:home",
        { lng: "pl" },
      ),
    },
    "/404": {
      pl: i18next.t(
        "paths:404",
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
        articlesMap[`/${key}`] = { pl: path };
      }

      return articlesMap;
    })(),
  };

  const pageContexts: PageContext[] = [];

  for (const pageContext of prerenderContext.pageContexts) {
    const { urlOriginal } = pageContext;

    if (urlOriginal in pathsMap) {
      for (const locale of locales) {
        if (locale in pathsMap[urlOriginal]) {
          const localizedUrl = pathsMap[urlOriginal][locale];

          pageContexts.push({
            ...pageContext,
            locale,
            urlOriginal: localizedUrl,
          });
        }
      }
    }
  }

  return { prerenderContext: { pageContexts } };
};

export { onPrerenderStart };
