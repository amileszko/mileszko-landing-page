import { Trigger } from "@radix-ui/react-tabs";
import { cn } from "@utils/classNameUtils";

import { Button } from "../Button/Button";
import { H4 } from "../Header";

const TabsTrigger = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Trigger>) => (
  <Trigger
    className={
      cn(
        `
          group mx-auto flex flex-col items-center
          justify-center outline-none
        `,
        className,
      )
    }
    {...props}
    asChild
  >
    <Button variant="navigation-link">
      <H4 className="group-data-[state=active]:font-bold">{children}</H4>
    </Button>
  </Trigger>
);

export { TabsTrigger };
