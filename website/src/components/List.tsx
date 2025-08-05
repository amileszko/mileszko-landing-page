import { cn } from "@utils/classNameUtils";
import { type VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

const unorderedListVariants = cva(
  `
    ml-4 flex list-none flex-col gap-2
    md:ml-6
  `,
  {
    variants: {
      variant: {
        primary: "text-base",
        secondary: `
          ml-0 text-sm
          md:ml-0
        `,
      },
    },
  },
);

const unorderedListIconVariants = cva(
  undefined,
  {
    variants: {
      list: {
        arrow: "text-brand-600",
        bullet: "text-brand-600",
        checkmark: "text-success-600",
        cross: "text-error-600",
      },
    },
  },
);

const unorderedListItemVariants = cva(
  undefined,
  {
    variants: {
      variant: {
        primary: "text-neutral-800",
        secondary: "text-neutral-600",
      },
    },
  },
);

interface UnorderedListProps
  extends React.ComponentProps<"ul">,
  VariantProps<typeof unorderedListIconVariants>,
  VariantProps<typeof unorderedListVariants> {
  items: string[]
}

const UnorderedList = ({
  className,
  items,
  list,
  variant,
  ...props
}: UnorderedListProps) => {
  const icon = {
    arrow: "→",
    bullet: "•",
    checkmark: "✓",
    cross: "✗",
  }[list ?? "bullet"];

  return (
    <ul
      {...props}
      className={
        cn(
          unorderedListVariants({ variant }),
          className,
        )
      }
    >
      {
        items.map(item => (
          <li className="flex items-start gap-2" key={item}>
            <span className={
              cn(unorderedListIconVariants({ list }))
            }
            >
              {icon}
            </span>
            <p className={
              cn(unorderedListItemVariants({ variant }))
            }
            >
              {item}
            </p>
          </li>
        ))
      }
    </ul>
  );
};

const OrderedList = ({
  className,
  ...props
}: React.ComponentProps<"ol">) => {
  return (
    <ol
      className={
        cn(
          "flex list-inside list-decimal flex-col gap-2",
          className,
        )
      }
      {...props}
    />
  );
};

export { OrderedList, UnorderedList };
