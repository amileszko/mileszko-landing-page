import { Root } from "@radix-ui/react-separator";
import { cn } from "@utils/classNameUtils";
import { cva, type VariantProps } from "class-variance-authority";

const separatorVariants = cva(
  "shrink-0 bg-neutral-200",
  {
    defaultVariants: { orientation: "horizontal" },
    variants: {
      orientation: {
        horizontal: "h-px w-full",
        vertical: "h-full w-px",
      },
    },
  },
);

const Separator = ({
  className,
  decorative = true,
  orientation,
  ...props
}: Omit<React.ComponentProps<typeof Root>, "orientation"> &
  VariantProps<typeof separatorVariants>) => {
  return (
    <Root
      className={
        cn(
          separatorVariants({ orientation }),
          className,
        )
      }
      decorative={decorative}
      orientation={orientation ?? undefined}
      {...props}
    />
  );
};

export { Separator, separatorVariants };
