import { extractArticleId } from "@components/hooks/useArticleId";
import { type PageContext } from "vike/types";

import i18next from "../../../i18n/config";

export default (pageContext: PageContext) =>
  i18next.t(
    `articles:articles.${extractArticleId(pageContext.urlPathname)}.description`,
    { lng: pageContext.locale },
  );
