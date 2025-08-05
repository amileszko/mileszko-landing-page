import { animationVariants } from "@utils/animationUtils";
import { getWindow } from "@utils/windowUtils";
import { AnimatePresence, motion } from "motion/react";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";

import { Button } from "../Button/Button";
import { useDialog } from "../Dialog/DialogProvider";
import { type CookiesCategory } from "./CookiesCategories";
import { CookiesDialog } from "./CookiesDialog/CookiesDialog";

interface CookiesPreferencesContextType {
  hideCookiesDialog: () => void
  isOpen: boolean
  openCookiesDialog: () => void
}

const CookiesPreferencesContext =
  createContext<CookiesPreferencesContextType | undefined>(undefined);

const useCookiesPreferences = () => {
  const context = use(CookiesPreferencesContext);

  if (!context) {
    throw new Error("useCookiesPreferences must be used within a CookiesPreferencesProvider");
  }

  return context;
};

interface CookieConsentData {
  acceptedCookiesCategoriesNames: string[]
}

const CookiesPreferences = ({ children }: { children: React.ReactNode }) => {
  const [
    cookies,
    setCookie,
  ] = useCookies<"cookieConsent", { cookieConsent?: CookieConsentData }>(["cookieConsent"]);
  const { locale } = usePageContext();
  const { t } = useTranslation(
    undefined,
    { lng: locale },
  );
  const {
    hide,
    isOpen,
    show,
  } = useDialog();

  const updateGtagConsent = useCallback(
    (acceptedCookiesCategoriesNames: string[]) => {
      const window = getWindow();

      if (window?.gtag) {
        const hasMarketingConsent = acceptedCookiesCategoriesNames.includes(t("cookies:categories.marketing.name"));
        const hasStatisticsConsent = acceptedCookiesCategoriesNames.includes(t("cookies:categories.statistics.name"));

        window.gtag(
          "consent",
          "update",
          {
            ad_personalization: hasMarketingConsent ? "granted" : "denied",
            ad_storage: hasMarketingConsent ? "granted" : "denied",
            ad_user_data: hasMarketingConsent ? "granted" : "denied",
            analytics_storage: hasStatisticsConsent ? "granted" : "denied",
          },
        );
      }
    },
    [t],
  );

  const cookiesCategories: CookiesCategory[] = useMemo(
    () => [
      {
        description: t("cookies:categories.necessary.description"),
        name: t("cookies:categories.necessary.name"),
        providers: [
          {
            cookies: [
              {
                description: t("cookies:providers.mileszko.cookies.cookieConsent.description"),
                duration: t("cookies:providers.mileszko.cookies.cookieConsent.duration"),
                name: t("cookies:providers.mileszko.cookies.cookieConsent.name"),
                type: t("cookies:providers.mileszko.cookies.cookieConsent.type"),
              },
            ],
            provider: {
              name: t("cookies:providers.mileszko.name"),
              url: t("cookies:providers.mileszko.url"),
            },
          },
        ],
        required: true,
      },
      {
        description: t("cookies:categories.preferences.description"),
        name: t("cookies:categories.preferences.name"),
        providers: [],
        required: false,
      },
      {
        description: t("cookies:categories.statistics.description"),
        name: t("cookies:categories.statistics.name"),
        providers: [
          {
            cookies: [
              {
                description: t("cookies:providers.googleAnalytics.cookies.ga.description"),
                duration: t("cookies:providers.googleAnalytics.cookies.ga.duration"),
                name: t("cookies:providers.googleAnalytics.cookies.ga.name"),
                type: t("cookies:providers.googleAnalytics.cookies.ga.type"),
              },
            ],
            provider: {
              name: t("cookies:providers.googleAnalytics.name"),
              url: t("cookies:providers.googleAnalytics.url"),
            },
          },
        ],
        required: false,
      },
      {
        description: t("cookies:categories.marketing.description"),
        name: t("cookies:categories.marketing.name"),
        providers: [],
        required: false,
      },
    ],
    [t],
  );

  const hideCookiesDialog = useCallback(
    () => {
      hide();
    },
    [hide],
  );

  const saveConsent = useCallback(
    (acceptedCookiesCategoriesNames: string[]) => {
      const consentData = {
        acceptedCookiesCategoriesNames,
        consentDate: new Date()
          .toISOString(),
      };

      setCookie(
        "cookieConsent",
        consentData,
        {
          maxAge: 6 * 30 * 24 * 60 * 60,
          path: "/",
          sameSite: "lax",
          secure: true,
        },
      );

      updateGtagConsent(acceptedCookiesCategoriesNames);
      hideCookiesDialog();
    },
    [
      setCookie,
      updateGtagConsent,
      hideCookiesDialog,
    ],
  );

  const openCookiesDialog = useCallback(
    () => {
      show(
        CookiesDialog,
        {
          acceptedCookiesCategoriesNames:
        cookies.cookieConsent?.acceptedCookiesCategoriesNames ?? [],
          cookiesCategories,
          onSaveConsent: saveConsent,
        },
      );
    },
    [
      cookies.cookieConsent,
      cookiesCategories,
      saveConsent,
      show,
    ],
  );

  useEffect(
    () => {
      if (cookies.cookieConsent) {
        updateGtagConsent(cookies.cookieConsent.acceptedCookiesCategoriesNames);
      }
      else {
        openCookiesDialog();
      }
    },
    [
      cookies.cookieConsent,
      openCookiesDialog,
      updateGtagConsent,
    ],
  );

  const contextValue = useMemo(
    () => ({
      hideCookiesDialog,
      isOpen,
      openCookiesDialog,
    }),
    [
      hideCookiesDialog,
      isOpen,
      openCookiesDialog,
    ],
  );

  return (
    <CookiesPreferencesContext value={contextValue}>
      {children}
      <AnimatePresence initial={false}>
        {
          !isOpen && (
            <motion.div
              animate="end"
              className="fixed bottom-6 left-6"
              exit="start"
              initial="start"
              transition={
                {
                  duration: 0.2,
                  ease: "easeInOut",
                }
              }
              variants={animationVariants.showUp}
            >
              <Button
                aria-label={t("cookies:buttonLabel")}
                className="size-14 rounded-full p-0"
                onClick={openCookiesDialog}
                variant="cta-secondary"
              >
                🍪
              </Button>
            </motion.div>
          )
        }
      </AnimatePresence>
    </CookiesPreferencesContext>
  );
};

export { CookiesPreferences, useCookiesPreferences };
