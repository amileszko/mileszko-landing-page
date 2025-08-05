import { cn } from "@utils/classNameUtils";

import { Slot } from "./Slot";

interface SectionProps extends React.ComponentProps<"section"> {
  asChild?: boolean
}

const Section = ({
  asChild,
  children,
  className,
  ...props
}: SectionProps) => {
  const Component = asChild ? Slot : "section";

  return (
    <div className="relative flex flex-col overflow-hidden">
      <Component
        className={
          cn(
            `
              mx-auto flex w-full max-w-3xl flex-col
              items-start gap-8 px-4
              md:px-6
            `,
            className,
          )
        }
        {...props}
      >
        {children}
      </Component>
    </div>
  );
};

export { Section };
