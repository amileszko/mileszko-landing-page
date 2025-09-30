import {
  Badge,
  Content,
  H1,
  LargeBlock,
  MediumBlock,
  OrderedList,
  Section,
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
          <Badge>
            {t("privacyPolicy:sections.policy.badge")}
          </Badge>

          <MediumBlock>
            <H1>{t("privacyPolicy:sections.policy.title")}</H1>
            <Trans
              components={
                {
                  awsLink: (
                    <TextLink
                      href={t("paths:aws")}
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
                  googleAnalyticsOptOutLink: (
                    <TextLink
                      href={t("paths:googleAnalyticsOptOut")}
                      rel="noopener noreferrer"
                      target="_blank"
                    />
                  ),
                  googleAnalyticsPolicyLink: (
                    <TextLink
                      href={t("paths:googleAnalyticsPolicy")}
                      rel="noopener noreferrer"
                      target="_blank"
                    />
                  ),
                  listItem: <li />,
                  primaryOrderedList: (
                    <OrderedList className="gap-6 text-base text-neutral-800" />
                  ),
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
              i18nKey="privacyPolicy:sections.policy.description"
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
