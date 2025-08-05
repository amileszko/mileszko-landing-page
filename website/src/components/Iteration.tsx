import { cn } from "@utils/classNameUtils";

import { LargeBlock } from "./Block";

interface IterationProps extends React.ComponentProps<"div"> {
  last?: boolean
  number: number
}

const Iteration = ({
  children,
  className,
  number,
  ...props
}: IterationProps) => {
  return (
    <div
      className={
        cn(
          "relative",
          className,
        )
      }
      {...props}
    >
      <div
        className={
          `
            absolute top-0 bottom-0 left-8 w-0.5
            bg-gradient-to-b from-brand-400 to-brand-600
          `
        }
      />

      <div className="relative">
        <LargeBlock className="flex-row">
          <div
            className={
              `
                flex h-16 w-16 flex-shrink-0 items-center
                justify-center rounded-full bg-brand-500 font-bold text-neutral-50
              `
            }
          >
            {number}
          </div>

          {children}
        </LargeBlock>
      </div>
    </div>
  );
};

export { Iteration };
