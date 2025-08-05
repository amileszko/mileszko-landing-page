import vikeReactQuery from "vike-react-query/config";
import vikeReact from "vike-react/config";
import { type Config } from "vike/types";

export default {
  bodyHtmlBegin:
    process.env.VITE_GOOGLE_TAG_MANAGER_ID ?
      `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.VITE_GOOGLE_TAG_MANAGER_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>` :
      undefined,
  extends: [
    vikeReact,
    vikeReactQuery,
  ],
  passToClient: [
    "locale",
    "urlLogical",
  ],
  prerender: true,
} satisfies Config;
