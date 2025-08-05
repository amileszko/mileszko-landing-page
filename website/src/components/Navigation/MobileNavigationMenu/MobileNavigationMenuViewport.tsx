import { Viewport } from "@radix-ui/react-navigation-menu";
import { cn } from "@utils/classNameUtils";

const MobileNavigationMenuViewport = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Viewport>) => (
  <Viewport
    className={cn(className)}
    {...props}
    forceMount
    onPointerEnter={
      (event) => {
        event.preventDefault();
      }
    }
    onPointerLeave={
      (event) => {
        event.preventDefault();
      }
    }
    onPointerMove={
      (event) => {
        event.preventDefault();
      }
    }
  >
    {children}
  </Viewport>
);

export { MobileNavigationMenuViewport };
