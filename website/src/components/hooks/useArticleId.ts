import { usePageContext } from "vike-react/usePageContext";

const extractArticleId = (urlPathname: string) => {
  return urlPathname.split("/")[2];
};

const useArticleId = () => {
  const { urlPathname } = usePageContext();

  return extractArticleId(urlPathname);
};

export { extractArticleId, useArticleId };
