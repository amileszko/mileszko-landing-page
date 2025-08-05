import { type PageContext } from "vike/types";

import i18next from "../../../../../i18n/config";

export default (pageContext: PageContext) =>
  i18next.t(
    "articles:articles.2-28-07-2025.description",
    { lng: pageContext.locale },
  );
