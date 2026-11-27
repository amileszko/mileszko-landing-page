import { extractArticleId } from "@components/hooks/useArticleId";
import { type PageContext } from "vike/types";

import { getArticleContent } from "../../../i18n/config";

const data = async (pageContext: PageContext) => {
  const articleId = extractArticleId(pageContext.urlPathname);

  return { content: await getArticleContent(articleId) };
};

type Data = Awaited<ReturnType<typeof data>>;

export { data };
export type { Data };
