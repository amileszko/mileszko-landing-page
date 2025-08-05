import { Title } from "@radix-ui/react-dialog";
import { cn } from "@utils/classNameUtils";

const DialogTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof Title>) => (
  <Title
    className={
      cn(
        "font-heading text-h4 font-semibold",
        className,
      )
    }
    {...props}
  />
);

export { DialogTitle };
