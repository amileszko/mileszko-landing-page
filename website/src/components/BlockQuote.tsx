import { cn } from "@utils/classNameUtils";
import { type ComponentProps } from "react";

const BlockQuote = ({ children, className }: ComponentProps<"blockquote">) => {
  return (
    <blockquote className={
      cn(
        className,
        `
          rounded-r-md border-l-4 border-brand-500 bg-brand-50 p-4
          font-medium
        `,
      )
    }
    >
      {children}
    </blockquote>
  );
};

export { BlockQuote };
