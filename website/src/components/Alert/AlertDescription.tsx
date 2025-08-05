import { cn } from "@utils/classNameUtils";

const AlertDescription = ({
  className,
  ...props
}: React.ComponentProps<"p">) => (
  <p
    className={
      cn(
        "text-sm font-semibold",
        className,
      )
    }
    {...props}
  />
);

export { AlertDescription };
