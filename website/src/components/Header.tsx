import { cn } from "@utils/classNameUtils";

const H1 = ({
  children,
  className,
  ...props
}: React.ComponentProps<"h1">) => {
  return (
    <h1
      className={
        cn(
          `
            font-heading text-h2 font-semibold
            md:text-h1
          `,
          className,
        )
      }
      {...props}
    >
      {children}
    </h1>
  );
};

const H2 = ({
  children,
  className,
  ...props
}: React.ComponentProps<"h2">) => {
  return (
    <h2
      className={
        cn(
          `
            font-heading text-h3 font-semibold
            md:text-h2
          `,
          className,
        )
      }
      {...props}
    >
      {children}
    </h2>
  );
};

const H3 = ({
  children,
  className,
  ...props
}: React.ComponentProps<"h3">) => {
  return (
    <h3
      className={
        cn(
          "font-heading text-h3 font-medium",
          className,
        )
      }
      {...props}
    >
      {children}
    </h3>
  );
};

const H4 = ({
  children,
  className,
  ...props
}: React.ComponentProps<"h4">) => {
  return (
    <h4
      className={
        cn(
          "font-heading text-h4 font-medium",
          className,
        )
      }
      {...props}
    >
      {children}
    </h4>
  );
};

export { H1, H2, H3, H4 };
