import { useStructuredData } from "@components/hooks";
import { useArticleId } from "@components/hooks/useArticleId";
import { useTranslation } from "react-i18next";
import { type BlogPosting, type Graph } from "schema-dts";
import { usePageContext } from "vike-react/usePageContext";

const Head = () => {
  const { locale } = usePageContext();
  const { t } = useTranslation(
    undefined,
    { lng: locale },
  );
  const articleId = useArticleId();
  const {
    owner,
    webPage,
    website,
  } = useStructuredData();

  const blogPost: BlogPosting = {
    "@id": `${import.meta.env.VITE_HOST_NAME}${t(`paths:articles.${articleId}`)}/#blogPost`,
    "@type": "BlogPosting",
    "articleSection": t(`articles:articles.${articleId}.article.category`),
    "author": { "@id": owner["@id"] },
    "datePublished": new Date(t(`articles:articles.${articleId}.article.date`))
      .toISOString(),
    "headline": t(`articles:articles.${articleId}.article.title`),
    "inLanguage": locale,
    "isPartOf": { "@id": webPage["@id"] },
    "mainEntityOfPage": { "@id": webPage["@id"] },
    "name": t(`articles:articles.${articleId}.article.title`),
    "publisher": { "@id": owner["@id"] },
  };

  const graph: Graph = {
    "@context": "https://schema.org",
    "@graph": [
      owner,
      website,
      webPage,
      blogPost,
    ],
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(graph)}
    </script>
  );
};

export default Head;
