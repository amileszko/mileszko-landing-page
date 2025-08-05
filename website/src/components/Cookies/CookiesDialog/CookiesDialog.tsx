import { useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";

import { Button } from "../../Button/Button";
import { Dialog } from "../../Dialog/Dialog";
import { DialogContent } from "../../Dialog/DialogContent";
import { DialogDescription } from "../../Dialog/DialogDescription";
import { DialogTitle } from "../../Dialog/DialogTitle";
import { Link } from "../../Link";
import { PrimaryParagraph } from "../../Paragraph";
import { Separator } from "../../Separator";
import { Tabs } from "../../Tabs/Tabs";
import { TabsList } from "../../Tabs/TabsList";
import { TabsTrigger } from "../../Tabs/TabsTrigger";
import { CookiesCategories, type CookiesCategory } from "../CookiesCategories";
import { CookiesDialogTabsContent } from "./CookiesDialogTabs";

interface CookiesDialogProps {
  acceptedCookiesCategoriesNames: string[]
  cookiesCategories: CookiesCategory[]
  onSaveConsent: (acceptedCookiesCategoriesNames: string[]) => void
}

const CookiesDialog = ({
  acceptedCookiesCategoriesNames,
  cookiesCategories,
  onSaveConsent,
}: CookiesDialogProps) => {
  const { locale } = usePageContext();
  const { t } = useTranslation(
    undefined,
    { lng: locale },
  );

  const defaultTabValue = "agreement";
  const [
    tabValue,
    setTabValue,
  ] = useState<"about" | "agreement" | "details">(defaultTabValue);

  const allCategoriesNames = useMemo(
    () =>
      cookiesCategories
        .filter(category => category.providers.length > 0)
        .map(category => category.name),
    [cookiesCategories],
  );

  const requiredCategoriesNames = useMemo(
    () =>
      cookiesCategories
        .filter(category => category.required && category.providers.length > 0)
        .map(category => category.name),
    [cookiesCategories],
  );

  const [
    cookiesCategoriesNamesToAccept,
    setCookiesCategoriesNamesToAccept,
  ] =
    useState([
      ...requiredCategoriesNames,
      ...acceptedCookiesCategoriesNames,
    ]);

  const handleAcceptAll = () => {
    setCookiesCategoriesNamesToAccept(allCategoriesNames);
    onSaveConsent(allCategoriesNames);
  };

  const handleAcceptRequired = () => {
    setCookiesCategoriesNamesToAccept(requiredCategoriesNames);
    onSaveConsent(requiredCategoriesNames);
  };

  const handleAcceptSelected = () => {
    setCookiesCategoriesNamesToAccept(cookiesCategoriesNamesToAccept);
    onSaveConsent(cookiesCategoriesNamesToAccept);
  };

  const handleCategoryAcceptChange = (
    categoryName: string,
    accepted: boolean,
  ) => {
    if (accepted) {
      setCookiesCategoriesNamesToAccept(prev => [
        ...prev,
        categoryName,
      ]);
    }
    else {
      setCookiesCategoriesNamesToAccept(prev =>
        prev.filter(name => name !== categoryName));
    }
  };

  return (
    <Dialog open>
      <DialogContent
        onEscapeKeyDown={
          (e) => {
            e.preventDefault();
          }
        }
        onInteractOutside={
          (e) => {
            e.preventDefault();
          }
        }
        onPointerDownOutside={
          (e) => {
            e.preventDefault();
          }
        }
      >
        <DialogTitle>{t("cookies:title")}</DialogTitle>

        <DialogDescription className="sr-only">
          {t("cookies:description")}
        </DialogDescription>

        <Tabs
          className="flex flex-col gap-6"
          defaultValue={defaultTabValue}
          onValueChange={
            (value) => {
              setTabValue(value as "about" | "agreement" | "details");
            }
          }
          value={tabValue}
        >
          <div className="flex flex-col gap-4">
            <TabsList className="flex gap-4">
              <TabsTrigger value="agreement">
                {t("cookies:agreement.title")}
              </TabsTrigger>
              <TabsTrigger value="details">
                {t("cookies:details.title")}
              </TabsTrigger>
              <TabsTrigger value="about">
                {t("cookies:about.title")}
              </TabsTrigger>
            </TabsList>

            <Separator />
          </div>

          <CookiesDialogTabsContent value="agreement">
            <DialogDescription>
              <Trans i18nKey="cookies:agreement.description" t={t} />
            </DialogDescription>
          </CookiesDialogTabsContent>

          <CookiesDialogTabsContent value="details">
            <CookiesCategories
              cookiesCategories={cookiesCategories}
              cookiesCategoriesNamesToAccept={cookiesCategoriesNamesToAccept}
              onCategoryAcceptChange={handleCategoryAcceptChange}
            />
          </CookiesDialogTabsContent>

          <CookiesDialogTabsContent value="about">
            <PrimaryParagraph>
              <Trans
                components={
                  {
                    cookiesPolicyLink: (
                      <Link
                        className={
                          `
                            inline-block
                            md:text-base
                          `
                        }
                        href={t("paths:cookiesPolicy")}
                        variant="cta-link"
                      />
                    ),
                  }
                }
                i18nKey="cookies:about.description"
                t={t}
              />
            </PrimaryParagraph>
          </CookiesDialogTabsContent>
        </Tabs>

        <Separator />

        <div
          className={
            `
              grid grid-cols-1 gap-2
              md:grid-cols-3
            `
          }
        >
          <Button onClick={handleAcceptRequired} variant="cta-secondary">
            {t("cookies:necessaryOnly")}
          </Button>
          {
            tabValue === "details" ?
              (
                <Button onClick={handleAcceptSelected} variant="cta-secondary">
                  {t("cookies:acceptSelected")}
                </Button>
              ) :
              (
                <Button
                  onClick={
                    () => {
                      setTabValue("details");
                    }
                  }
                  variant="cta-secondary"
                >
                  {t("cookies:customize")}
                </Button>
              )
          }
          <Button onClick={handleAcceptAll} variant="cta-primary">
            {t("cookies:acceptAll")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { CookiesDialog, type CookiesDialogProps };
