import { useTranslation } from "react-i18next";
import { type Person, type WebPage, type WebSite } from "schema-dts";
import { usePageContext } from "vike-react/usePageContext";

const useStructuredData = () => {
  const pageContext = usePageContext();
  const {
    config,
    locale,
    urlOriginal,
  } = pageContext;
  const { t } = useTranslation(
    undefined,
    { lng: locale },
  );

  const owner: Person & { "@id": string } = {
    "@id": `${import.meta.env.VITE_HOST_NAME}${t("paths:aboutMe")}/#owner`,
    "@type": "Person",
    "email": t("paths:email"),
    "jobTitle": t("common:structuredData.owner.jobTitle"),
    "name": t("common:structuredData.owner.name"),
    "sameAs": [
      t("paths:github"),
      t("paths:linkedin"),
    ],
    "url": `${import.meta.env.VITE_HOST_NAME}${t("paths:aboutMe")}/`,
  };

  const website: WebSite & { "@id": string } = {
    "@id": `${import.meta.env.VITE_HOST_NAME}/#website`,
    "@type": "WebSite",
    "description": t("home:description"),
    "inLanguage": locale,
    "name": t("home:title"),
    "publisher": { "@id": owner["@id"] },
    "url": `${import.meta.env.VITE_HOST_NAME}/`,
  };

  const webPage: WebPage & { "@id": string } = {
    "@id": `${import.meta.env.VITE_HOST_NAME}${urlOriginal === "/" ? "" : urlOriginal}/#webPage`,
    "@type": "WebPage",
    "author": { "@id": owner["@id"] },
    "creator": { "@id": owner["@id"] },
    "description": typeof config.description === "string" ?
      config.description :
      config.description?.(pageContext) ?? "",
    "inLanguage": locale,
    "isPartOf": { "@id": website["@id"] },
    "name": typeof config.title === "string" ?
      config.title :
      config.title?.(pageContext) ?? "",
    "url": `${import.meta.env.VITE_HOST_NAME}${urlOriginal === "/" ? "/" : `${urlOriginal}/`}`,
  };

  return {
    owner,
    webPage,
    website,
  };
};

export { useStructuredData };
