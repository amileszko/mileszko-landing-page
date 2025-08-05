import { cn } from "@utils/classNameUtils";

import { PrimaryParagraph } from "./Paragraph";

const SectionHint = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof PrimaryParagraph>) => {
  return (
    <PrimaryParagraph
      className={
        cn(
          "w-full border-l-2 border-l-neutral-300 pl-4",
          className,
        )
      }
      {...props}
    >
      {children}
    </PrimaryParagraph>
  );
};

export { SectionHint };
