import i18next from "i18next";
import ChainedBackend from "i18next-chained-backend";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";

import {
  getAllNamespaces,
  getPageNamespaces,
  SHARED_NAMESPACES,
} from "../routes";

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
        ns: import.meta.env.SSR ? getAllNamespaces() : SHARED_NAMESPACES,
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
