import { cn } from "@utils/classNameUtils";

const Strong = ({
  children,
  className,
  ...props
}: React.ComponentProps<"strong">) => {
  return (
    <strong
      className={
        cn(
          "font-semibold",
          className,
        )
      }
      {...props}
    >
      {children}
    </strong>
  );
};

export { Strong };
