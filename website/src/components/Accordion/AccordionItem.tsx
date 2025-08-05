import { Item } from "@radix-ui/react-accordion";
import { cn } from "@utils/classNameUtils";
import { createContext } from "react";

const AccordionItemContext = createContext<string | undefined>(undefined);

const AccordionItem = ({
  children,
  className,
  value,
  ...props
}: React.ComponentProps<typeof Item>) => (
  <Item className={cn(className)} value={value} {...props}>
    <AccordionItemContext value={value}>{children}</AccordionItemContext>
  </Item>
);

export { AccordionItem, AccordionItemContext };
