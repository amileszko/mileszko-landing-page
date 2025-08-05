import { type motion } from "motion/react";
import { createElement } from "react";

const createAnimationStagger =
  (Component: ReturnType<typeof motion.create>): ((
    props: React.ComponentProps<typeof Component> & {
      animationDelay?: number
      staggerDirection?: -1 | 1
      staggerInterval: number
    },
  ) => React.ReactElement) =>
    ({
      animationDelay = 0,
      staggerDirection = 1,
      staggerInterval,
      ...props
    }: React.ComponentProps<typeof Component> & {
      animationDelay?: number
      staggerDirection?: -1 | 1
      staggerInterval: number
    }) => {
      const stagger = {
        end: {
          transition: {
            delayChildren: animationDelay,
            staggerChildren: staggerInterval,
            staggerDirection: staggerDirection,
          },
        },
        start: {},
      };

      const AnimationStagger = createElement(
        Component,
        {
          variants: stagger,
          ...props,
        },
      );

      return AnimationStagger;
    };

const createInViewAnimationStagger =
  (Component: ReturnType<typeof motion.create>) =>
    ({
      animationDelay = 0,
      staggerDirection = 1,
      staggerInterval,
      ...props
    }: React.ComponentProps<typeof Component> & {
      animationDelay?: number
      staggerDirection?: -1 | 1
      staggerInterval: number
    }) =>
      createAnimationStagger(Component)({
        animationDelay,
        initial: "start",
        staggerDirection,
        staggerInterval,
        viewport: { once: true },
        whileInView: "end",
        ...props,
      });

const animationVariants = {
  card: {
    end: {
      opacity: 1,
      originX: 0,
      originY: 0,
      rotateY: 0,
      transformPerspective: 2000,
    },
    start: {
      opacity: 0,
      originX: 0,
      originY: 0,
      rotateY: -45,
      transformPerspective: 2000,
    },
  },
  showUp: {
    end: {
      opacity: 1,
      scale: 1,
    },
    start: {
      opacity: 0,
      scale: 0.95,
    },
  },
  slideRight: {
    end: {
      opacity: 1,
      x: 0,
    },
    start: {
      opacity: 0,
      x: -20,
    },
  },
  slideUp: {
    end: {
      opacity: 1,
      y: 0,
    },
    start: {
      opacity: 0,
      y: 20,
    },
  },
} as const;

const animated =
  (Component: ReturnType<typeof motion.create>) =>
    ({
      animationDelay,
      animationVariant,
      duration = 0.5,
      ...props
    }: React.ComponentProps<typeof Component> & {
      animationDelay?: number
      animationVariant: keyof typeof animationVariants
      duration?: number
    }): React.ReactElement => {
      const Animation = createElement(
        Component,
        {
          transition: {
            duration: duration,
            ease: "easeOut",
            ...(animationDelay !== undefined && { delay: animationDelay }),
          },
          variants: animationVariants[animationVariant],
          ...props,
        },
      );

      return Animation;
    };

const inViewAnimated =
  (Component: ReturnType<typeof motion.create>) =>
    ({
      animationDelay,
      animationVariant,
      ...props
    }: React.ComponentProps<typeof Component> & {
      animationDelay?: number
      animationVariant: keyof typeof animationVariants
    }) =>
      animated(Component)({
        animationDelay,
        animationVariant,
        initial: "start",
        viewport: { once: true },
        whileInView: "end",
        ...props,
      });

export {
  animated,
  animationVariants,
  createAnimationStagger,
  createInViewAnimationStagger,
  inViewAnimated,
};
