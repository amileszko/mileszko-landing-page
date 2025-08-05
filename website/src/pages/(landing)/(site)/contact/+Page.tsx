import {
  Badge,
  Callout,
  Card,
  ContactForm,
  Content,
  CtaGroup,
  Grid,
  H1,
  H2,
  H3,
  H4,
  LargeBlock,
  MediumBlock,
  PrimaryParagraph,
  Section,
  Separator,
  SmallBlock,
  TextBox,
} from "@components";
import { UnorderedList } from "@components/List";
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
          <Badge>{t("contact:sections.hero.badge")}</Badge>

          <MediumBlock>
            <H1>{t("contact:sections.hero.title")}</H1>

            <H2 className="relative text-neutral-600">
              {t("contact:sections.hero.subtitle")}
            </H2>

            <Callout>{t("contact:sections.hero.callout")}</Callout>
          </MediumBlock>
        </LargeBlock>

        <SmallBlock>
          <H3>{t("contact:sections.hero.whatNext.title")}</H3>

          <UnorderedList
            items={
              t(
                "contact:sections.hero.whatNext.bullets",
                { returnObjects: true },
              ) as string[]
            }
            list="arrow"
            variant="primary"
          />
        </SmallBlock>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("contact:sections.brief.title")}</H2>

          <PrimaryParagraph>
            {t("contact:sections.brief.description")}
          </PrimaryParagraph>

          <ContactForm />
        </MediumBlock>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("contact:sections.calendar.title")}</H2>

          <PrimaryParagraph>
            {t("contact:sections.calendar.description")}
          </PrimaryParagraph>

          <CtaGroup
            links={
              [
                {
                  description: t("contact:sections.calendar.link.description"),
                  external: true,
                  href: t("paths:calendar"),
                  label: t("contact:sections.calendar.link.title"),
                },
              ]
            }
          />
        </MediumBlock>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("contact:sections.directInfo.title")}</H2>

          <Grid columns={2}>
            {
              (
                t(
                  "contact:sections.directInfo.items",
                  { returnObjects: true },
                ) as {
                  external?: boolean
                  href: string
                  icon: string
                  label: string
                  linkLabel: string
                  value: string
                }[]
              ).map(item => (
                <TextBox
                  external={item.external}
                  icon={item.icon}
                  key={item.label}
                  link={item.href}
                  linkLabel={item.linkLabel}
                  subtitle={item.value}
                  title={item.label}
                />
              ))
            }
          </Grid>
        </MediumBlock>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("contact:sections.faq.title")}</H2>

          <Grid columns={1}>
            {
              (
                t(
                  "contact:sections.faq.faqs",
                  { returnObjects: true },
                ) as {
                  answer: string
                  question: string
                }[]
              ).map(question => (
                <Card key={question.question}>
                  <SmallBlock>
                    <H4>{question.question}</H4>
                    <PrimaryParagraph>{question.answer}</PrimaryParagraph>
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
          <H2>{t("contact:sections.links.title")}</H2>

          <Grid columns={2}>
            {
              (
                t(
                  "contact:sections.links.links",
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
      </Section>
    </Content>
  );
};

export { Page };
