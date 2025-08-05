import { Root } from "@radix-ui/react-label";
import { cn } from "@utils/classNameUtils";

const Label = ({
  className,
  ...props
}: React.ComponentProps<typeof Root>) => {
  return (
    <Root
      className={
        cn(
          `
            text-sm
            peer-disabled:cursor-not-allowed peer-disabled:opacity-70
          `,
          className,
        )
      }
      {...props}
    />
  );
};

export { Label };
