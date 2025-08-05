import { animated } from "@utils/animationUtils";
import { motion } from "motion/react";

import { AccordionItem } from "./AccordionItem";

const MotionAccordionItem = motion.create(AccordionItem);

const AnimatedAccordionItem = ({ ...props }:
React.ComponentProps<typeof MotionAccordionItem>) => {
  return animated(MotionAccordionItem)({
    animationVariant: "card",
    ...props,
  });
};

export { AnimatedAccordionItem };
