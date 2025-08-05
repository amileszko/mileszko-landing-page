import { AnimatePresence, useMotionValueEvent, useScroll } from "motion/react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";

import { Link } from "../../Link";
import {
  NavigationMenu,
  type NavigationMenuLinkProps,
} from "../NavigationMenu/NavigationMenu";
import { NavigationMenuItem } from "../NavigationMenu/NavigationMenuItem";
import { NavigationMenuLink } from "../NavigationMenu/NavigationMenuLink";
import { NavigationMenuList } from "../NavigationMenu/NavigationMenuList";
import {
  AnimatedMobileNavigationMenuViewport,
} from "./AnimatedMobileNavigationMenuViewport";
import { MobileNavigationMenuContent } from "./MobileNavigationMenuContent";
import { MobileNavigationMenuTrigger } from "./MobileNavigationMenuTrigger";

interface MobileNavigationMenuProps extends
  Omit<React.ComponentProps<typeof NavigationMenu>, "variant"> {
  links: NavigationMenuLinkProps[]
}

const MobileNavigationMenu = ({
  links,
  ...props
}: MobileNavigationMenuProps) => {
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
  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  const onValueChangeHandler = useCallback(
    (value: string) => {
      setMenuValue(value);
      setIsOpen(value !== "");
    },
    [],
  );

  const onCloseHandler = useCallback(
    () => {
      setMenuValue("");
      setIsOpen(false);
    },
    [],
  );

  return (
    <NavigationMenu
      onValueChange={
        onValueChangeHandler
      }
      value={menuValue}
      variant={isOpen ? "dark" : "transparent"}
      {...props}
    >
      <NavigationMenuList
        backgroundColor={isScrolled ? "dark" : "transparent"}
        textColor={isScrolled || isOpen ? "white" : "black"}
        transitionEasing={isScrolled || isOpen ? "easeOut" : "easeIn"}
      >
        <NavigationMenuItem value="home">
          <NavigationMenuLink asChild href={t("paths:home")}>
            <Link
              aria-label={t("navigation:logo.label")}
              className="text-inherit"
              href={t("paths:home")}
              onClick={
                () => {
                  onCloseHandler();
                }
              }
              variant="navigation-link"
            >
              {t("navigation:logo.title")}
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem value="menu">
          <MobileNavigationMenuTrigger />
          <MobileNavigationMenuContent>
            <ul className="flex flex-col items-start">
              {
                links.map(link => (
                  <NavigationMenuItem key={link.name} value={link.name}>
                    <NavigationMenuLink asChild href={link.path}>
                      <Link href={link.path} variant="navigation-link">
                        {link.name}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))
              }
            </ul>
          </MobileNavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>

      <AnimatePresence>
        {
          isOpen && (
            <AnimatedMobileNavigationMenuViewport
              animate={
                {
                  height: "100dvh",
                  opacity: 1,
                }
              }
              exit={
                {
                  height: 0,
                  opacity: 0,
                  transition: {
                    duration: 0.2,
                    ease: "easeIn",
                  },
                }
              }
              initial={
                {
                  height: 0,
                  opacity: 0,
                }
              }
              transition={
                {
                  duration: 0.2,
                  ease: "easeOut",
                }
              }
            />
          )
        }
      </AnimatePresence>
    </NavigationMenu>
  );
};

export { MobileNavigationMenu };
