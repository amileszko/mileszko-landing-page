import { modifyUrl } from "vike/modifyUrl";
import { type Url } from "vike/types";

import { getRouteByPathname } from "../routes";

const locales = [
  "en",
  "pl",
];

const onBeforeRoute = (pageContext: { urlParsed: Url }) => {
  const { pathname } = pageContext.urlParsed;
  const locale = locales.find(locale => pathname.startsWith(`/${locale}`)) ??
    "pl";
  const route = getRouteByPathname(pathname);
  const pathnameWithoutLocale = route?.logicalPath ?? pathname;
  const urlWithoutLocale = modifyUrl(
    pageContext.urlParsed.href,
    { pathname: pathnameWithoutLocale },
  );

  return {
    pageContext: {
      locale,
      urlLogical: urlWithoutLocale,
    },
  };
};

export { onBeforeRoute };
