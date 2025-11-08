import { Footer, Navigation } from "@components";
import { CookiesPreferences } from "@components/Cookies";
import { DialogProvider, DialogRenderer } from "@components/Dialog";
import { type JSX } from "react";
import { CookiesProvider } from "react-cookie";

const Layout = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <CookiesProvider>
      <DialogProvider>
        <CookiesPreferences>
          <DialogRenderer />
          <div className="flex min-h-dvh flex-col bg-neutral-50">
            <Navigation />
            <main className="mt-12">{children}</main>
            <Footer />
          </div>
        </CookiesPreferences>
      </DialogProvider>
    </CookiesProvider>
  );
};

export { Layout };
