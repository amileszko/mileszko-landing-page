import { cn } from "@utils/classNameUtils";

import { Badge } from "./Badge/Badge";
import { Point } from "./Point";

const Status = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Badge>) => {
  return (
    <Badge
      className={
        cn(
          "bg-success-200 text-success-700",
          className,
        )
      }
      {...props}
    >
      <Point />
      {children}
    </Badge>
  );
};

export { Status };
