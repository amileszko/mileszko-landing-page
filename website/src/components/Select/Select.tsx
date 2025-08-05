import { Root, type SelectProps } from "@radix-ui/react-select";
import { animate } from "motion/react";
import { type JSX } from "react";
import { useCallback, useState } from "react";

const Select = ({
  children,
  ...props
}: SelectProps): JSX.Element => {
  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  const handleOpenChange = useCallback(
    async (open: boolean) => {
      if (!open) {
        const selectContentElement = document.querySelector("#select-content");

        if (selectContentElement) {
          await animate(
            selectContentElement,
            {
              opacity: 0,
              scale: 0.95,
            },
            {
              duration: 0.2,
              ease: "easeIn",
            },
          );
        }
      }
      setIsOpen(open);
    },
    [],
  );

  return (
    <Root
      onOpenChange={handleOpenChange}
      open={isOpen}
      {...props}
    >
      {children}
    </Root>
  );
};

export { Select };
