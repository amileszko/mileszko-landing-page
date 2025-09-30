import i18next from "i18next";
import ChainedBackend from "i18next-chained-backend";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";

const getArticles = async ():
Promise<Record<string, {
  article: Record<string, string> & {
    content?: string
  }
}>> => {
  const articlesContents = import.meta.glob(
    "./pl/articles/*.md",
    {
      import: "default",
      query: "?raw",
    },
  );
  const articlesMeta = import.meta.glob(
    "./pl/articles/*.json",
    {
      import: "default",
      query: "?raw",
    },
  );

  const articles: Record<string, {
    article: Record<string, string> & {
      content?: string
    }
  }> = {};

  for (const [
    path,
    meta,
  ] of Object.entries(articlesMeta)) {
    const fileName = path.replace(
      "./pl/articles/",
      "",
    )
      .replace(
        ".json",
        "",
      );

    articles[fileName] = JSON.parse(
      await meta() as string,
    ) as {
      article: Record<string, string> & {
        content?: string
      }
    };

    const contentPath = `./pl/articles/${fileName}.md`;

    if (contentPath in articlesContents) {
      articles[fileName].article.content =
      (await articlesContents[contentPath]()) as string;
    }
  }

  return articles;
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
                  { articles: await getArticles() },
              },
            }),
          ],
        },
        fallbackLng: false,
        lng: "pl",
        ns: [
          "paths",
          "common",
          "contact",
          "cookies",
          "cookiesPolicy",
          "footer",
          "home",
          "navigation",
          "offer",
          "privacyPolicy",
          "error",
          "forCto",
          "forFounders",
          "forRecruiters",
          "aboutMe",
          "process",
          "stack",
          "projects",
          "blog",
          "articles",
        ],
        supportedLngs: [
          "pl",
          "en",
        ],
      });
  })();

  await i18nextInitPromise;
};

export {
  initI18next,
};

export default i18next;
