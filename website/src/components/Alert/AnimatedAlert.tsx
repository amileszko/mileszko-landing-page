import { animated } from "@utils/animationUtils";
import { AnimatePresence, motion } from "motion/react";

import { Alert } from "./Alert";

const MotionAlert = motion.create(Alert);

const AnimatedAlert = ({
  isVisible,
  ...props
}: React.ComponentProps<typeof Alert> &
  React.ComponentProps<typeof MotionAlert> & {
    isVisible: boolean
  }) => {
  const alert = animated(MotionAlert)({
    animate: "end",
    animationVariant: "showUp",
    duration: 0.2,
    exit: "start",
    initial: "start",
    ...props,
  });

  return <AnimatePresence>{isVisible && alert}</AnimatePresence>;
};

AnimatedAlert.displayName = "AnimatedAlert";

export { AnimatedAlert };
