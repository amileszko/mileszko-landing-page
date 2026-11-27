import { type PageContext } from "vike/types";

import { initI18next } from "../i18n/config";
import { getRouteByLogicalPath } from "../routes";

const onPrerenderStart = async (prerenderContext: {
  pageContexts: PageContext[]
}) => {
  await initI18next();

  const pageContexts: PageContext[] = [];

  for (const pageContext of prerenderContext.pageContexts) {
    const route = getRouteByLogicalPath(pageContext.urlOriginal);

    if (!route) {
      continue;
    }

    for (const [
      locale,
      localizedUrl,
    ] of Object.entries(route.paths)) {
      pageContexts.push({
        ...pageContext,
        locale,
        urlOriginal: localizedUrl,
      });
    }
  }

  return { prerenderContext: { pageContexts } };
};

export { onPrerenderStart };
