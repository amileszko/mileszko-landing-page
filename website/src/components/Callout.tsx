import { cn } from "@utils/classNameUtils";

const Callout = ({
  children,
  className,
  ...props
}: React.ComponentProps<"p">) => {
  return (
    <p
      className={
        cn(
          `
            w-full rounded-md border-brand-200 bg-brand-50 px-4
            py-3 font-medium
            md:px-6 md:py-4
          `,
          className,
        )
      }
      {...props}
    >
      {children}
    </p>
  );
};

export { Callout };
