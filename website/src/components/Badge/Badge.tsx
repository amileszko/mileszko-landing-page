import { cn } from "@utils/classNameUtils";

const Badge = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div
    className={
      cn(
        `
          inline-flex w-fit items-center justify-center gap-3
          rounded-full bg-brand-200 px-4 py-2 text-sm
          font-medium break-words hyphens-auto text-brand-700
        `,
        className,
      )
    }
    {...props}
  />
);

export { Badge };
