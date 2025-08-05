import { Root } from "@radix-ui/react-accordion";
import { cn } from "@utils/classNameUtils";
import { createContext, useState } from "react";

const AccordionContext = createContext<string | undefined>(undefined);

const Accordion = ({
  children,
  className,
  ...props
}: Omit<
  React.ComponentProps<typeof Root>,
  "collapsible" | "defaultValue" | "onValueChange" | "type" | "value"
>) => {
  const [
    value,
    setValue,
  ] = useState<string | undefined>();

  return (
    <Root
      className={
        cn(
          "flex w-full flex-col gap-6",
          className,
        )
      }
      collapsible
      onValueChange={setValue}
      type="single"
      value={value}
      {...props}
    >
      <AccordionContext value={value}>{children}</AccordionContext>
    </Root>
  );
};

export { Accordion, AccordionContext };
