import { Content } from "@radix-ui/react-dialog";
import { cn } from "@utils/classNameUtils";
import { motion } from "motion/react";

import { DialogOverlay } from "./DialogOverlay";
import { DialogPortal } from "./DialogPortal";

const DialogContent = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Content>) => {
  return (
    <DialogPortal forceMount>
      <DialogOverlay key="dialog-overlay" />
      <motion.div
        animate={
          {
            opacity: 1,
            scale: 1,
          }
        }
        className={
          `
            fixed inset-0 z-50 flex flex-col
            items-center justify-center p-4
            md:p-6
          `
        }
        exit={
          {
            opacity: 0,
            scale: 0.95,

            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          }
        }
        initial={
          {
            opacity: 0,
            scale: 0.95,
          }
        }
        key="dialog-content"
        transition={
          {
            duration: 0.2,
            ease: "easeOut",
          }
        }
      >
        <Content
          className={
            cn(
              `
                relative flex w-full max-w-3xl flex-col
                gap-6 overflow-y-auto rounded-md bg-neutral-50 p-4
                outline-none
                md:p-6
              `,
              className,
            )
          }
          {...props}
        >
          {children}
        </Content>
      </motion.div>
    </DialogPortal>
  );
};

export { DialogContent };
