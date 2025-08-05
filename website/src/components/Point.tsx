import { cn } from "@utils/classNameUtils";

const Point = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
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
      <div className="h-2 w-2 rounded-full bg-success-500" />
      <div
        className={
          `
            absolute inset-0 h-2 w-2 animate-ping
            rounded-full bg-success-400 opacity-75
          `
        }
      />
    </div>
  );
};

export { Point };
