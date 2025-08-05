import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "h1",
            "h2",
            "h3",
            "h4",
            "base",
            "sm",
            "xs",
          ],
        },
      ],
    },
  },
});

const cn = (...inputs: ClassValue[]) => customTwMerge(clsx(inputs));

export { cn };
