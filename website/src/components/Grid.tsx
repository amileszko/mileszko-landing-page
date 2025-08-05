import { cn } from "@utils/classNameUtils";
import { type VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

import { Slot } from "./Slot";

const gridVariants = cva(
  "grid w-full grid-cols-1",
  {
    defaultVariants: { gap: "normal" },
    variants: {
      columns: {
        1: "grid-cols-1",
        2: "md:grid-cols-2",
        3: "md:grid-cols-3",
        4: "lg:grid-cols-4",
      },
      gap: {
        loose: "gap-6",
        normal: "gap-4",
        tight: "gap-2",
      },
    },
  },
);

interface GridProps
  extends React.ComponentProps<"div">,
  VariantProps<typeof gridVariants> {
  asChild?: boolean
}

const Grid = ({
  asChild,
  children,
  className,
  columns,
  gap,
  ...props
}: GridProps) => {
  const Component = asChild ? Slot : "div";

  return (
    <Component
      className={
        cn(
          gridVariants({
            columns,
            gap,
          }),
          className,
        )
      }
      {...props}
    >
      {children}
    </Component>
  );
};

export { Grid };
