import { Overlay } from "@radix-ui/react-dialog";
import { cn } from "@utils/classNameUtils";
import { motion } from "motion/react";

const DialogOverlay = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Overlay>) => {
  return (
    <Overlay
      className={
        cn(
          "fixed inset-0 z-50 bg-neutral-900/80",
          className,
        )
      }
      {...props}
      asChild
    >
      <motion.div
        animate={
          { opacity: 1 }
        }
        exit={
          {
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          }
        }
        initial={
          { opacity: 0 }
        }
        transition={
          {
            duration: 0.2,
            ease: "easeOut",
          }
        }
      >
        {children}
      </motion.div>
    </Overlay>
  );
};

export { DialogOverlay };
