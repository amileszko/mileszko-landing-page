import { Content } from "@radix-ui/react-accordion";
import { cn } from "@utils/classNameUtils";
import { AnimatePresence, motion } from "motion/react";
import { use } from "react";

import { AccordionContext } from "./Accordion";
import { AccordionItemContext } from "./AccordionItem";

const AccordionContent = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Content>) => {
  const selectedValue = use(AccordionContext);
  const itemValue = use(AccordionItemContext);

  const isOpen = selectedValue === itemValue;

  return (
    <>
      {!isOpen && <div className="sr-only">{children}</div>}
      <AnimatePresence initial={false}>
        {
          isOpen && (
            <Content
              asChild
              className="w-full overflow-hidden"
              forceMount
              {...props}
            >
              <motion.div
                animate={
                  {
                    height: "auto",
                    opacity: 1,
                  }
                }
                exit={
                  {
                    height: 0,
                    opacity: 0,
                  }
                }
                initial={
                  {
                    height: 0,
                    opacity: 0,
                  }
                }
                transition={
                  {
                    duration: 0.2,
                    ease: "easeInOut",
                  }
                }
              >
                <div className={cn(className)}>{children}</div>
              </motion.div>
            </Content>
          )
        }
      </AnimatePresence>
    </>
  );
};

export { AccordionContent };
