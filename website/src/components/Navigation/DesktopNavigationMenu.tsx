import { useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";

import { Link } from "../Link";
import { type NavigationMenuLinkProps } from "./NavigationMenu/NavigationMenu";
import { NavigationMenu } from "./NavigationMenu/NavigationMenu";
import { NavigationMenuItem } from "./NavigationMenu/NavigationMenuItem";
import { NavigationMenuLink } from "./NavigationMenu/NavigationMenuLink";
import { NavigationMenuList } from "./NavigationMenu/NavigationMenuList";

interface DesktopNavigationMenuLinkProps
  extends Omit<React.ComponentProps<typeof NavigationMenu>, "variant"> {
  links: NavigationMenuLinkProps[]
}

const DesktopNavigationMenu = ({
  links,
  ...props
}: DesktopNavigationMenuLinkProps) => {
  const { locale } = usePageContext();
  const { t } = useTranslation(
    undefined,
    { lng: locale },
  );
  const { scrollYProgress } = useScroll();
  const [
    isScrolled,
    setIsScrolled,
  ] = useState(false);

  useMotionValueEvent(
    scrollYProgress,
    "change",
    (value: number) => {
      setIsScrolled(value > 0);
    },
  );
  const [
    menuValue,
    setMenuValue,
  ] = useState("");

  return (
    <NavigationMenu
      onValueChange={
        (value) => {
          setMenuValue(value);
        }
      }
      value={menuValue}
      variant="transparent"
      {...props}
    >
      <NavigationMenuList
        backgroundColor={isScrolled ? "dark" : "transparent"}
        textColor={isScrolled ? "white" : "black"}
        transitionEasing={isScrolled ? "easeOut" : "easeIn"}
      >
        <NavigationMenuItem value="home">
          <NavigationMenuLink asChild href={t("paths:home")}>
            <Link
              aria-label={t("navigation:logo.label")}
              className="text-inherit"
              href={t("paths:home")}
              variant="navigation-link"
            >
              {t("navigation:logo.title")}
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <ul className="flex gap-6">
          {
            links.map(link => (
              <NavigationMenuItem key={link.name} value={link.name}>
                <NavigationMenuLink asChild href={link.path}>
                  <Link
                    className="text-inherit"
                    href={link.path}
                    variant="navigation-link"
                  >
                    {link.name}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))
          }
        </ul>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export { DesktopNavigationMenu };
