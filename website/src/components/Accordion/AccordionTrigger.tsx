import { Header, Trigger } from "@radix-ui/react-accordion";
import { cn } from "@utils/classNameUtils";

const AccordionTrigger = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Trigger>) => (
  <Header className="flex">
    <Trigger className={cn(className)} {...props}>
      {children}
    </Trigger>
  </Header>
);

export { AccordionTrigger };
