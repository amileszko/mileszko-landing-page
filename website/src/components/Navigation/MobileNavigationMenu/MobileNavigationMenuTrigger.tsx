import { Trigger } from "@radix-ui/react-navigation-menu";
import { cn } from "@utils/classNameUtils";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";

import { Button } from "../../Button/Button";

const MobileNavigationMenuTrigger = ({
  className,
  ...props
}: React.ComponentProps<typeof Trigger>) => {
  const { locale } = usePageContext();
  const { t } = useTranslation(
    undefined,
    { lng: locale },
  );

  return (
    <Trigger
      className={
        cn(
          "group",
          className,
        )
      }
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
      {...props}
      asChild
    >
      <Button
        aria-label={t("navigation:mobileNavigationMenu.buttonLabel")}
        className="text-inherit"
        variant="navigation-link"
      >
        <span
          className={
            `
              group-data-[active]:hidden
              group-data-[state=open]:hidden
            `
          }
        >
          {t("navigation:mobileNavigationMenu.openButtonTitle")}
        </span>
        <span
          className={
            `
              hidden
              group-data-[active]:block
              group-data-[state=open]:block
            `
          }
        >
          {t("navigation:mobileNavigationMenu.closeButtonTitle")}
        </span>
      </Button>
    </Trigger>
  );
};

export { MobileNavigationMenuTrigger };
