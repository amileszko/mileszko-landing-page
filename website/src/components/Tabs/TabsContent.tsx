import { Content } from "@radix-ui/react-tabs";
import { cn } from "@utils/classNameUtils";

const TabsContent = ({
  children,
  className,
  value,
  ...props
}: React.ComponentProps<typeof Content>) => {
  return (
    <Content
      className={
        cn(
          "outline-none",
          className,
        )
      }
      value={value}
      {...props}
    >
      {children}
    </Content>
  );
};

export { TabsContent };
