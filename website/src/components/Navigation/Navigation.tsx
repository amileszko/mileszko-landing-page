import { type JSX } from "react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";

import { useScreenSize } from "../hooks/useScreenSize";
import { DesktopNavigationMenu } from "./DesktopNavigationMenu";
import {
  MobileNavigationMenu,
} from "./MobileNavigationMenu/MobileNavigationMenu";
import { type NavigationMenuLinkProps } from "./NavigationMenu/NavigationMenu";

const Navigation = (): JSX.Element => {
  const { locale } = usePageContext();
  const { t } = useTranslation(
    undefined,
    { lng: locale },
  );

  const navigationMenuLinks: NavigationMenuLinkProps[] = [
    {
      name: t("navigation:projects"),
      path: t("paths:projects"),
    },
    {
      name: t("navigation:offer"),
      path: t("paths:offer"),
    },
    {
      name: t("navigation:process"),
      path: t("paths:process"),
    },
    {
      name: t("navigation:aboutMe"),
      path: t("paths:aboutMe"),
    },
    {
      name: t("navigation:contact"),
      path: t("paths:contact"),
    },
    {
      name: t("navigation:blog"),
      path: t("paths:blog"),
    },
  ];

  const screenSize = useScreenSize();

  return screenSize === "sm" ?
    (
      <MobileNavigationMenu
        links={navigationMenuLinks}
      />
    ) :
    (
      <DesktopNavigationMenu
        links={navigationMenuLinks}
      />
    );
};

export { Navigation };
