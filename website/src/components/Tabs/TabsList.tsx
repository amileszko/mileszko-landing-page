import { List } from "@radix-ui/react-tabs";
import { cn } from "@utils/classNameUtils";

const TabsList = ({
  className,
  ...props
}: React.ComponentProps<typeof List>) => (
  <List
    className={
      cn(
        "inline-flex w-full items-center justify-between",
        className,
      )
    }
    {...props}
  />
);

export { TabsList };
