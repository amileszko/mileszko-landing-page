import { useStructuredData } from "@components/hooks";
import { useTranslation } from "react-i18next";
import { type BlogPosting, type Graph } from "schema-dts";
import { usePageContext } from "vike-react/usePageContext";

const Head = () => {
  const { locale } = usePageContext();
  const { t } = useTranslation(
    undefined,
    { lng: locale },
  );

  const {
    owner,
    webPage,
    website,
  } = useStructuredData();

  const blogPost: BlogPosting = {
    "@id": `${import.meta.env.VITE_HOST_NAME}${t("paths:articles.11-24-09-2025")}/#blogPost`,
    "@type": "BlogPosting",
    "articleSection": t("articles:articles.11-24-09-2025.article.category"),
    "author": { "@id": owner["@id"] },
    "datePublished": new Date("2025-09-24")
      .toISOString(),
    "headline": t("articles:articles.11-24-09-2025.article.title"),
    "inLanguage": locale,
    "isPartOf": { "@id": webPage["@id"] },
    "mainEntityOfPage": { "@id": webPage["@id"] },
    "name": t("articles:articles.11-24-09-2025.article.title"),
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
