import { MarkdownArticle, Section, Separator } from "@components";
import { ArticleHeader } from "@components/ArticleHeader";
import { useArticleId } from "@components/hooks/useArticleId";
import { type JSX } from "react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";

const Page = (): JSX.Element => {
  const { locale } = usePageContext();
  const { t } = useTranslation(
    undefined,
    { lng: locale },
  );
  const articleId = useArticleId();

  return (
    <>
      <Section>
        <ArticleHeader
          category={t(`articles:articles.${articleId}.article.category`)}
          date={t(`articles:articles.${articleId}.article.date`)}
          readingTime={t(`articles:articles.${articleId}.article.readingTime`)}
        />

        <Separator />

        <MarkdownArticle
          markdown={t(`articles:articles.${articleId}.article.content`)}
        />

        <Separator />
      </Section>
    </>
  );
};

export { Page };
