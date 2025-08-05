import { Content } from "@radix-ui/react-navigation-menu";
import { cn } from "@utils/classNameUtils";
import { RemoveScroll } from "react-remove-scroll";

const MobileNavigationMenuContent = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Content>) => (
  <Content
    className={
      cn(
        `
          flex h-full w-full flex-col items-start
          gap-4 p-4
        `,
        className,
      )
    }
    onFocusOutside={
      (event) => {
        event.preventDefault();
      }
    }
    onInteractOutside={
      (event) => {
        event.preventDefault();
      }
    }
    onPointerDownOutside={
      (event) => {
        event.preventDefault();
      }
    }
    {...props}
  >
    <RemoveScroll
      allowPinchZoom
      className="flex size-full flex-col justify-between"
    >
      {children}
    </RemoveScroll>
  </Content>
);

export { MobileNavigationMenuContent };
