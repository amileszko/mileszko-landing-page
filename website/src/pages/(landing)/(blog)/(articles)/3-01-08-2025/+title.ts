import { type PageContext } from "vike/types";

import i18next from "../../../../../i18n/config";

export default (pageContext: PageContext) =>
  i18next.t(
    "articles:articles.3-01-08-2025.title",
    { lng: pageContext.locale },
  );
