import { MarkdownArticle, Section, Separator } from "@components";
import { ArticleHeader } from "@components/ArticleHeader";
import { type JSX } from "react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";

const Page = (): JSX.Element => {
  const { locale } = usePageContext();
  const { t } = useTranslation(
    undefined,
    { lng: locale },
  );

  return (
    <>
      <Section>
        <ArticleHeader
          category={t("articles:articles.9-06-09-2025.article.category")}
          date={t("articles:articles.9-06-09-2025.article.date")}
          readingTime={t("articles:articles.9-06-09-2025.article.readingTime")}
        />

        <Separator />

        <MarkdownArticle
          markdown={t("articles:articles.9-06-09-2025.article.content")}
        />

        <Separator />
      </Section>
    </>
  );
};

export { Page };
