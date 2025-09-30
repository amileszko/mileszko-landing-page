import i18next, { initI18next } from "../../i18n/config";

const onBeforePrerenderStart = async (): Promise<string[]> => {
  await initI18next();

  const articles = i18next.t(
    "paths:articles",
    {
      lng: "pl",
      returnObjects: true,
    },
  ) as Record<string, string>;

  return Object.keys(articles)
    .map(article => `/blog/${article}`);
};

export { onBeforePrerenderStart };

