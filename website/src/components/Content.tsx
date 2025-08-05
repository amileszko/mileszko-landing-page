import { cn } from "@utils/classNameUtils";

const Content = ({ children, className }: React.ComponentProps<"div">) => {
  return (
    <div
      className={
        cn(
          `
            flex flex-col gap-12 py-8
            md:gap-16 md:py-16
          `,
          className,
        )
      }
    >
      {children}
    </div>
  );
};

export { Content };
