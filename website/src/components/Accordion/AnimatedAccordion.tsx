import { createInViewAnimationStagger } from "@utils/animationUtils";
import { motion } from "motion/react";

import { Accordion } from "./Accordion";

const MotionAccordion = motion.create(Accordion);

const AnimatedAccordion = ({ ...props }:
React.ComponentProps<typeof MotionAccordion>) =>
  createInViewAnimationStagger(MotionAccordion)({
    animationDelay: 0.7,
    staggerInterval: 0.2,
    ...props,
  });

export { AnimatedAccordion };
