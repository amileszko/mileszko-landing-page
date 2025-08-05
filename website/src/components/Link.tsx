import { cn } from "@utils/classNameUtils";

import { Button } from "./Button/Button";

interface LinkProps extends React.ComponentProps<typeof Button> {
  download?: boolean
  href: string
  rel?: string
  target?: string
}

const Link = ({
  children,
  className,
  download,
  href,
  rel,
  target,
  ...props
}: LinkProps) => {
  return (
    <Button className={cn(className)} {...props} asChild>
      <a download={download} href={href} rel={rel} target={target}>
        {children}
      </a>
    </Button>
  );
};

export { Link };
