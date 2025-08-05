import { cn } from "@utils/classNameUtils";

import { Button } from "./Button/Button";

const TextLink = ({
  children,
  className,
  href,
  ...props
}: React.ComponentProps<"a">) => {
  return (
    <Button
      asChild
      className={
        cn(
          className,
          "inline-block text-base",
        )
      }
      variant="cta-link"
    >
      <a href={href} {...props}>
        {children}
      </a>
    </Button>
  );
};

export { TextLink };
