import { Footer, Navigation } from "@components";
import { CookiesPreferences } from "@components/Cookies";
import { DialogProvider, DialogRenderer } from "@components/Dialog";
import { type JSX } from "react";
import { CookiesProvider } from "react-cookie";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";

const Layout = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const { locale } = usePageContext();
  const { t } = useTranslation(
    undefined,
    { lng: locale },
  );

  return (
    <CookiesProvider>
      <DialogProvider>
        <CookiesPreferences>
          <DialogRenderer />
          <div className="flex min-h-dvh flex-col bg-neutral-50">
            <a
              className={
                `
                  sr-only
                  focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50
                  focus:rounded-md focus:bg-neutral-900 focus:px-4 focus:py-2 focus:text-neutral-50
                `
              }
              href="#main-content"
            >
              {t("common:skipToContent")}
            </a>
            <header>
              <Navigation />
            </header>
            <main
              className="mt-12"
              id="main-content"
              tabIndex={-1}
            >
              {children}
            </main>
            <Footer />
          </div>
        </CookiesPreferences>
      </DialogProvider>
    </CookiesProvider>
  );
};

export { Layout };
