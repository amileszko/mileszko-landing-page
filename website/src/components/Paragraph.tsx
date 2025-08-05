import { cn } from "@utils/classNameUtils";

const PrimaryParagraph = ({
  children,
  className,
  ...props
}: React.ComponentProps<"p">) => {
  return (
    <p
      className={
        cn(
          "text-base text-neutral-800",
          className,
        )
      }
      {...props}
    >
      {children}
    </p>
  );
};

const SecondaryParagraph = ({
  children,
  className,
  ...props
}: React.ComponentProps<"p">) => {
  return (
    <p
      className={
        cn(
          "text-sm text-neutral-600 italic",
          className,
        )
      }
      {...props}
    >
      {children}
    </p>
  );
};

export { PrimaryParagraph, SecondaryParagraph };
