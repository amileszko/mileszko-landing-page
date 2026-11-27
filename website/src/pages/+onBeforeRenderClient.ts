import { type PageContext } from "vike/types";

import { initI18next, loadPageNamespaces } from "../i18n/config";

const onBeforeRenderClient = async (pageContext: PageContext) => {
  await initI18next();
  await loadPageNamespaces(pageContext.urlLogical ?? "/");
};

export default onBeforeRenderClient;
