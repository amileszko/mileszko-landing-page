import { cn } from "@utils/classNameUtils";
import { cva } from "class-variance-authority";

import { Badge } from "./Badge";

interface CategoryBadgeProps extends React.ComponentProps<typeof Badge> {
  isSelected: boolean
}

const categoryBadgeVariants = cva(
  `
    cursor-pointer px-3 py-1 text-neutral-700 transition-all
    duration-200 ease-in-out
    hover:bg-neutral-300
  `,
  {
    variants: {
      isSelected: {
        false: "bg-neutral-200",
        true: "bg-neutral-300",
      },
    },
  },
);

const CategoryBadge = ({
  className,
  isSelected = false,
  ...props
}: CategoryBadgeProps) => (
  <Badge
    className={
      cn(
        categoryBadgeVariants({ isSelected }),
        className,
      )
    }
    {...props}
  />
);

export { CategoryBadge };
