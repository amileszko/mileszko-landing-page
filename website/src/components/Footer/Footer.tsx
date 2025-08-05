import { type JSX } from "react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";

import { MediumBlock } from "../Block";
import { Content } from "../Content";
import { Link } from "../Link";
import { Point } from "../Point";
import { Section } from "../Section";
import { Separator } from "../Separator";
import { FooterLinksGroup } from "./FooterLinksGroup";

const Footer = (): JSX.Element => {
  const { locale } = usePageContext();
  const { t } = useTranslation(
    undefined,
    { lng: locale },
  );

  const footerLinkGroups = [
    {
      columns: [
        {
          links: [
            {
              name: t("footer:navigation.projects"),
              path: t("paths:projects"),
            },
            {
              name: t("footer:navigation.offer"),
              path: t("paths:offer"),
            },
            {
              name: t("footer:navigation.process"),
              path: t("paths:process"),
            },
            {
              name: t("footer:navigation.aboutMe"),
              path: t("paths:aboutMe"),
            },
            {
              name: t("footer:navigation.stack"),
              path: t("paths:stack"),
            },
          ],
        },
        {
          links: [
            {
              name: t("footer:navigation.forCto"),
              path: t("paths:forCto"),
            },
            {
              name: t("footer:navigation.forFounders"),
              path: t("paths:forFounders"),
            },
            {
              name: t("footer:navigation.forRecruiters"),
              path: t("paths:forRecruiters"),
            },
            {
              name: t("footer:navigation.blog"),
              path: t("paths:blog"),
            },
            {
              name: t("footer:navigation.contact"),
              path: t("paths:contact"),
            },
          ],
        },
      ],
      title: t("footer:navigation.title"),
    },
    {
      columns: [
        {
          links: [
            {
              download: true,
              name: t("footer:shortcuts.cv"),
              path: t("paths:cv"),
            },
            {
              external: true,
              name: t("footer:shortcuts.github"),
              path: t("paths:github"),
            },
            {
              external: true,
              name: t("footer:shortcuts.linkedin"),
              path: t("paths:linkedin"),
            },
          ],
        },
      ],
      title: t("footer:shortcuts.title"),
    },
  ];

  const currentYear = new Date()
    .getFullYear();

  return (
    <Content className="bg-neutral-900">
      <Section asChild>
        <footer>
          <nav
            className={
              `
                grid w-full grid-cols-1 justify-between gap-6
                md:flex
              `
            }
          >
            {
              footerLinkGroups.map(group => (
                <FooterLinksGroup
                  columns={group.columns}
                  key={group.title}
                  title={group.title}
                />
              ))
            }
          </nav>

          <Separator className="bg-neutral-800" />

          <MediumBlock
            className={
              `
                justify-between text-xs text-neutral-400
                md:flex-row
              `
            }
          >
            <p className="w-full">
              {
                t(
                  "footer:copyright",
                  { year: currentYear },
                )
              }
            </p>

            <MediumBlock
              className={
                `
                  flex-row
                  md:justify-end
                `
              }
            >
              <Link
                href={t("paths:privacyPolicy")}
                variant="footer-link-secondary"
              >
                {t("footer:privacyPolicy")}
              </Link>
              <Link
                href={t("paths:cookiesPolicy")}
                variant="footer-link-secondary"
              >
                {t("footer:cookiesPolicy")}
              </Link>
              <div
                className="flex items-center gap-2 text-success-400"
              >
                <Point />
                {t("footer:status")}
              </div>
            </MediumBlock>
          </MediumBlock>
        </footer>
      </Section>
    </Content>
  );
};

export { Footer };
