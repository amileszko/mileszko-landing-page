import vikeReactQuery from "vike-react-query/config";
import vikeReact from "vike-react/config";
import { type Config } from "vike/types";

export default {
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
