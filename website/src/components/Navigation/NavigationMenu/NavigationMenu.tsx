import { Root } from "@radix-ui/react-navigation-menu";
import { cn } from "@utils/classNameUtils";
import { AnimatePresence, motion } from "motion/react";

interface NavigationMenuLinkProps {
  name: string
  path: string
}

const NavigationMenu = ({
  children,
  className,
  variant,
  ...props
}: React.ComponentProps<typeof Root> & {
  variant: "dark" | "transparent"
}) => (
  <AnimatePresence initial={false}>
    <Root
      className={
        cn(
          "fixed inset-x-0 top-0 z-10",
          className,
        )
      }
      {...props}
      asChild
    >
      <motion.div
        animate={
          {
            backgroundColor:
            variant === "dark" ? "var(--color-neutral-900)" : "var(--color-transparent)",
            color:
            variant === "dark" ? "var(--color-neutral-50)" : "var(--color-neutral-900)",
          }
        }
        transition={
          {
            color: {
              duration: 0.05,
              ease: "easeInOut",
            },
            default: {
              duration: 0.2,
              ease: variant === "dark" ? "easeOut" : "easeIn",
            },
          }
        }
      >
        {children}
      </motion.div>
    </Root>
  </AnimatePresence>
);

export { NavigationMenu, type NavigationMenuLinkProps };
