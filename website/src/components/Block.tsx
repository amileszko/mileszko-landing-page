import { cn } from "@utils/classNameUtils";

const SmallBlock = ({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={
        cn(
          "flex w-full flex-col items-start gap-2",
          className,
        )
      }
      {...props}
    >
      {children}
    </div>
  );
};

const MediumBlock = ({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={
        cn(
          "flex w-full flex-col items-start gap-6",
          className,
        )
      }
      {...props}
    >
      {children}
    </div>
  );
};

const LargeBlock = ({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={
        cn(
          "flex w-full flex-col items-start gap-8",
          className,
        )
      }
      {...props}
    >
      {children}
    </div>
  );
};

export { LargeBlock, MediumBlock, SmallBlock };
