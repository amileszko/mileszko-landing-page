import { Content, Portal, Viewport } from "@radix-ui/react-select";
import { cn } from "@utils/classNameUtils";
import { motion } from "motion/react";

import { SelectScrollDownButton } from "./SelectScrollDownButton";
import { SelectScrollUpButton } from "./SelectScrollUpButton";

const SelectContent = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Content>) => {
  return (
    <Portal>
      <Content
        arrowPadding={0}
        className={
          cn(
            `
              relative z-50 max-h-64 overflow-hidden rounded-md
              border border-neutral-500 bg-neutral-50 text-sm
            `,
            className,
          )
        }
        id="select-content"
        position="popper"
        sideOffset={2}
        {...props}
        asChild
      >
        <motion.div
          animate={
            {
              opacity: 1,
              scale: 1,
            }
          }
          initial={
            {
              opacity: 0,
              scale: 0.95,
            }
          }
          transition={
            {
              duration: 0.2,
              ease: "easeOut",
            }
          }
        >
          <SelectScrollUpButton />
          <Viewport
            className="h-[var(--radix-select-trigger-height)] w-[calc(var(--radix-select-trigger-width)-2px)]"
          >
            {children}
          </Viewport>
          <SelectScrollDownButton />
        </motion.div>
      </Content>
    </Portal>
  );
};

export { SelectContent };
