import { type PageContext } from "vike/types";

import i18next from "../../../../i18n/config";

export default (pageContext: PageContext) =>
  i18next.t(
    "privacyPolicy:title",
    { lng: pageContext.locale },
  );
