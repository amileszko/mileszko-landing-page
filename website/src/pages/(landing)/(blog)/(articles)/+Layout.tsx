import { CtaCard, Grid, MediumBlock, TextBox } from "@components";
import { ContactButton } from "@components/Button";
import { Content } from "@components/Content";
import { H2 } from "@components/Header";
import { Section } from "@components/Section";
import { type JSX } from "react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";

const Layout = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const { locale } = usePageContext();
  const { t } = useTranslation(
    undefined,
    { lng: locale },
  );

  return (
    <Content>
      { children }
      <Section>
        <MediumBlock>
          <H2>{t("blog:sections.links.title")}</H2>

          <Grid columns={2}>
            {
              (
                t(
                  "blog:sections.links.links",
                  { returnObjects: true },
                ) as {
                  icon: string
                  link: string
                  linkLabel: string
                  subtitle: string
                  title: string
                }[]
              ).map(link => (
                <TextBox
                  icon={link.icon}
                  key={link.title}
                  link={link.link}
                  linkLabel={link.linkLabel}
                  subtitle={link.subtitle}
                  title={link.title}
                />
              ))
            }
          </Grid>
        </MediumBlock>

        <CtaCard
          description={t("blog:sections.links.cta.description")}
          links={
            [
              {
                description: t("blog:sections.links.cta.links.0.description"),
                external: true,
                href: t("paths:calendar"),
                label: t("blog:sections.links.cta.links.0.title"),
                variant: "primary",
              },
              {
                description: t("blog:sections.links.cta.links.1.description"),
                href: t("paths:contactForm"),
                label: t("blog:sections.links.cta.links.1.title"),
                variant: "secondary",
              },
            ]
          }
          title={t("blog:sections.links.cta.title")}
          variant="primary"
        />
      </Section>
      <ContactButton />
    </Content>
  );
};

export { Layout };
