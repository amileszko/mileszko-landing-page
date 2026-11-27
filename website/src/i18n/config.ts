import i18next from "i18next";
import ChainedBackend from "i18next-chained-backend";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";

const articleMetadata = import.meta.glob(
  "./pl/articles/*.json",
  {
    eager: true,
    import: "default",
    query: "?raw",
  },
);

const articleContents = import.meta.glob(
  "./pl/articles/*.md",
  {
    import: "default",
    query: "?raw",
  },
);

const getArticles = () => {
  const articles: Record<string, {
    article: Record<string, string>
  }> = {};

  for (const [
    path,
    meta,
  ] of Object.entries(articleMetadata)) {
    const fileName = path.replace(
      "./pl/articles/",
      "",
    )
      .replace(
        ".json",
        "",
      );

    articles[fileName] = JSON.parse(
      meta,
    ) as {
      article: Record<string, string>
    };
  }

  return articles;
};

const getArticleContent = async (articleId: string): Promise<string> => {
  const contentPath = `./pl/articles/${articleId}.md`;
  const loader = articleContents[contentPath] as
    (() => Promise<string>) | undefined;

  return loader ? await loader() : "";
};

const sharedNamespaces = [
  "paths",
  "common",
  "navigation",
  "footer",
  "cookies",
];

const pageNamespaces = [
  "aboutMe",
  "articles",
  "blog",
  "contact",
  "cookiesPolicy",
  "error",
  "forCto",
  "forFounders",
  "forRecruiters",
  "home",
  "offer",
  "privacyPolicy",
  "process",
  "projects",
  "stack",
];

const allNamespaces = [
  ...sharedNamespaces,
  ...pageNamespaces,
];

const getPageNamespaces = (urlLogical: string): string[] => {
  if (urlLogical.startsWith("/blog/")) {
    return [
      "blog",
      "articles",
    ];
  }

  switch (urlLogical) {
    case "/": {
      return [
        "home",
        "articles",
      ];
    }
    case "/about-me": {
      return ["aboutMe"];
    }
    case "/blog": {
      return [
        "blog",
        "articles",
      ];
    }
    case "/contact": {
      return ["contact"];
    }
    case "/for-cto": {
      return ["forCto"];
    }
    case "/for-founders": {
      return ["forFounders"];
    }
    case "/for-recruiters": {
      return ["forRecruiters"];
    }
    case "/offer": {
      return ["offer"];
    }
    case "/policies/cookies-policy": {
      return ["cookiesPolicy"];
    }
    case "/policies/privacy-policy": {
      return ["privacyPolicy"];
    }
    case "/process": {
      return ["process"];
    }
    case "/projects": {
      return ["projects"];
    }
    case "/stack": {
      return ["stack"];
    }
    default: {
      return ["error"];
    }
  }
};

const loadPageNamespaces = async (urlLogical: string) => {
  await i18next.loadNamespaces(getPageNamespaces(urlLogical));
};

let i18nextInitPromise: Promise<void> | undefined;

const initI18next = async () => {
  i18nextInitPromise ??= (async () => {
    await i18next
      .use(ChainedBackend)
      .use(initReactI18next)
      .init({
        backend: {
          backends: [
            resourcesToBackend((
              language: string,
              namespace: string,
            ) =>
              import(`./${language}/${namespace}.json`)),
            resourcesToBackend({
              pl: {
                articles:
                  { articles: getArticles() },
              },
            }),
          ],
        },
        fallbackLng: false,
        lng: "pl",
        ns: import.meta.env.SSR ? allNamespaces : sharedNamespaces,
        supportedLngs: [
          "pl",
          "en",
        ],
      });
  })();

  await i18nextInitPromise;
};

export {
  getArticleContent,
  initI18next,
  loadPageNamespaces,
};

export default i18next;
