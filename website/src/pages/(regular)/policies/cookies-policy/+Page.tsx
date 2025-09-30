import {
  Badge,
  Content,
  H1,
  LargeBlock,
  MediumBlock,
  OrderedList,
  Section,
  Table,
  TextLink,
} from "@components";
import { ContactButton } from "@components/Button";
import { useCookiesPreferences } from "@components/Cookies";
import { type JSX } from "react";
import { Trans, useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";

const Page = (): JSX.Element => {
  const { locale } = usePageContext();
  const { t } = useTranslation(
    undefined,
    { lng: locale },
  );
  const { openCookiesDialog } = useCookiesPreferences();

  return (
    <Content>
      <Section>
        <LargeBlock>
          <Badge>{t("cookiesPolicy:sections.policy.badge")}</Badge>

          <MediumBlock>
            <H1>{t("cookiesPolicy:sections.policy.title")}</H1>
            <Trans
              components={
                {
                  appleSafariLink: (
                    <TextLink
                      href={t("paths:appleSafari")}
                      rel="noopener noreferrer"
                      target="_blank"
                    />
                  ),
                  contactLink: <TextLink href={t("paths:contact")} />,
                  cookiesLink: <TextLink onClick={openCookiesDialog} />,
                  cookiesPolicyLink: <TextLink href={t("paths:cookiesPolicy")} />,
                  emailLink: <TextLink href={`mailto:${t("paths:email")}`} />,
                  googleAnalyticsLink: (
                    <TextLink
                      href={t("paths:googleAnalytics")}
                      rel="noopener noreferrer"
                      target="_blank"
                    />
                  ),
                  googleChromeLink: (
                    <TextLink
                      href={t("paths:googleChrome")}
                      rel="noopener noreferrer"
                      target="_blank"
                    />
                  ),
                  listItem: <li />,
                  microsoftEdgeLink: (
                    <TextLink
                      href={t("paths:microsoftEdge")}
                      rel="noopener noreferrer"
                      target="_blank"
                    />
                  ),
                  mozillaFirefoxLink: (
                    <TextLink
                      href={t("paths:mozillaFirefox")}
                      rel="noopener noreferrer"
                      target="_blank"
                    />
                  ),
                  primaryOrderedList: (
                    <OrderedList className="gap-6 text-base text-neutral-800" />
                  ),
                  privacyPolicyLink: <TextLink href={t("paths:privacyPolicy")} />,
                  secondaryOrderedList: (
                    <OrderedList
                      className={
                        `
                          gap-2 pt-2 pl-4
                          md:pl-6
                        `
                      }
                    />
                  ),
                  table: (
                    <Table
                      headers={
                        t(
                          "cookiesPolicy:sections.policy.table.headers",
                          { returnObjects: true },
                        ) as string[]
                      }
                      rows={
                        t(
                          "cookiesPolicy:sections.policy.table.rows",
                          { returnObjects: true },
                        ) as string[][]
                      }
                    />
                  ),
                  unorderedList: (
                    <ul
                      className={
                        `
                          flex list-inside list-disc flex-col pl-4
                          md:pl-6
                        `
                      }
                    />
                  ),
                }
              }
              i18nKey="cookiesPolicy:sections.policy.description"
              t={t}
            />
          </MediumBlock>
        </LargeBlock>
      </Section>

      <ContactButton />
    </Content>
  );
};

export { Page };
