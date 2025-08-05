import {
  Articles,
  Badge,
  Callout,
  Card,
  Content,
  Grid,
  Section,
  SectionHint,
  Separator,
  TextBox,
} from "@components";
import { LargeBlock, MediumBlock, SmallBlock } from "@components/Block";
import { ContactButton } from "@components/Button";
import { CtaCard } from "@components/Card";
import { H1, H2, H4 } from "@components/Header";
import { PrimaryParagraph } from "@components/Paragraph";
import { type JSX } from "react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";

const Page = (): JSX.Element => {
  const { locale } = usePageContext();
  const { t } = useTranslation(
    undefined,
    { lng: locale },
  );

  return (
    <Content>
      <Section>
        <LargeBlock>
          <Badge>{t("blog:sections.hero.badge")}</Badge>

          <MediumBlock>
            <H1>{t("blog:sections.hero.title")}</H1>

            <H2 className="relative text-neutral-600">
              {t("blog:sections.hero.subtitle")}
            </H2>

            <Callout>
              {t("blog:sections.hero.description")}
            </Callout>
          </MediumBlock>
        </LargeBlock>

        <SectionHint>{t("blog:sections.hero.info")}</SectionHint>

        <Separator />
      </Section>

      <Section>
        <Articles />

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("blog:sections.faq.title")}</H2>

          <Grid columns={1}>
            {
              (
                t(
                  "blog:sections.faq.items",
                  { returnObjects: true },
                ) as {
                  answer: string
                  question: string
                }[]
              ).map(faq => (
                <Card key={faq.question}>
                  <SmallBlock>
                    <H4>{faq.question}</H4>
                    <PrimaryParagraph>{faq.answer}</PrimaryParagraph>
                  </SmallBlock>
                </Card>
              ))
            }
          </Grid>
        </MediumBlock>

        <Separator />
      </Section>

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

export { Page };
