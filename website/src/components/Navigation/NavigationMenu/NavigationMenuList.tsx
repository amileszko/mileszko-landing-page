import { List } from "@radix-ui/react-navigation-menu";
import { cn } from "@utils/classNameUtils";
import { motion } from "motion/react";

const NavigationMenuList = ({
  backgroundColor,
  children,
  className,
  textColor,
  transitionEasing,
  ...props
}: React.ComponentProps<typeof List> & {
  backgroundColor: "dark" | "transparent"
  textColor: "black" | "white"
  transitionEasing: "easeIn" | "easeOut"
}) => (
  <motion.div
    animate={
      {
        backgroundColor:
        backgroundColor === "dark" ? "var(--color-neutral-900)" : "var(--color-transparent)",
        color:
        textColor === "white" ?
          "var(--color-neutral-50)" :
          "var(--color-neutral-900)",
      }
    }
    className={cn(className)}
    transition={
      {
        color: {
          duration: 0.05,
          ease: "easeInOut",
        },
        default: {
          duration: 0.2,
          ease: transitionEasing === "easeOut" ? "easeOut" : "easeIn",
        },
      }
    }
  >
    <List
      className={
        `
          mx-auto flex w-full max-w-3xl list-none
          justify-between px-4 py-4
          md:px-6
        `
      }
      {...props}
    >
      {children}
    </List>
  </motion.div>
);

export { NavigationMenuList };
