import {
  Badge,
  Callout,
  Content,
  CtaGroup,
  Grid,
  Link,
  PersonasTextBox,
  Section,
  SectionHint,
  Separator,
  Table,
  TextBox,
} from "@components";
import { LargeBlock, MediumBlock, SmallBlock } from "@components/Block";
import { ContactButton } from "@components/Button";
import {
  Card,
  CtaCard,
  ExtendedPackageCard,
  FeatureCard,
  StatusCard,
} from "@components/Card";
import { H1, H2, H3, H4 } from "@components/Header";
import { UnorderedList } from "@components/List";
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
          <Badge>{t("offer:sections.hero.badge")}</Badge>

          <MediumBlock>
            <H1>{t("offer:sections.hero.title")}</H1>

            <H2 className="relative text-neutral-600">
              {t("offer:sections.hero.subtitle")}
            </H2>

            <Callout>{t("offer:sections.hero.callout")}</Callout>

            <CtaGroup
              links={
                [
                  {
                    description: t("offer:sections.hero.cta.0.description"),
                    external: true,
                    href: t("paths:calendar"),
                    label: t("offer:sections.hero.cta.0.title"),
                    variant: "primary",
                  },
                  {
                    description: t("offer:sections.hero.cta.1.description"),
                    href: t("paths:contactForm"),
                    label: t("offer:sections.hero.cta.1.title"),
                    variant: "secondary",
                  },
                ]
              }
            />
          </MediumBlock>
        </LargeBlock>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("offer:sections.forWho.title")}</H2>

          <Grid columns={1}>
            {
              (
                t(
                  "offer:sections.forWho.personas",
                  { returnObjects: true },
                ) as {
                  helpAndEffect: string
                  helpAndEffectTitle: string
                  icon: string
                  link: string
                  linkLabel: string
                  problems: string
                  problemsTitle: string
                  title: string
                }[]
              ).map(persona => (
                <PersonasTextBox
                  helpAndEffect={persona.helpAndEffect}
                  helpAndEffectTitle={persona.helpAndEffectTitle}
                  icon={persona.icon}
                  key={persona.title}
                  link={persona.link}
                  linkLabel={persona.linkLabel}
                  problems={persona.problems}
                  problemsTitle={persona.problemsTitle}
                  title={persona.title}
                />
              ))
            }
          </Grid>
        </MediumBlock>

        <MediumBlock>
          <H3>{t("offer:sections.forWho.fitCheck.title")}</H3>

          <SmallBlock>
            <H4>{t("offer:sections.forWho.fitCheck.yes.title")}</H4>
            <UnorderedList
              items={
                t(
                  "offer:sections.forWho.fitCheck.yes.bullets",
                  { returnObjects: true },
                ) as string[]
              }
              list="checkmark"
              variant="primary"
            />
          </SmallBlock>

          <SmallBlock>
            <H4>{t("offer:sections.forWho.fitCheck.no.title")}</H4>
            <UnorderedList
              items={
                t(
                  "offer:sections.forWho.fitCheck.no.bullets",
                  { returnObjects: true },
                ) as string[]
              }
              list="cross"
              variant="primary"
            />
          </SmallBlock>
        </MediumBlock>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("offer:sections.advantages.title")}</H2>

          <Grid columns={2}>
            {
              (
                t(
                  "offer:sections.advantages.advantages",
                  { returnObjects: true },
                ) as {
                  description: string
                  icon: string
                  title: string
                }[]
              ).map(advantage => (
                <StatusCard
                  description={advantage.description}
                  icon={advantage.icon}
                  key={advantage.title}
                  title={advantage.title}
                />
              ))
            }
          </Grid>
        </MediumBlock>

        <SectionHint>
          {t("offer:sections.advantages.hint.title")}
          {" "}
          <Link
            className={
              `
                inline-block
                md:text-base
              `
            }
            href={t("paths:process")}
            variant="cta-link"
          >
            {t("offer:sections.advantages.hint.linkTitle")}
          </Link>
        </SectionHint>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("offer:sections.comparison.title")}</H2>
          <PrimaryParagraph>
            {t("offer:sections.comparison.description")}
          </PrimaryParagraph>

          <Table
            headers={
              t(
                "offer:sections.comparison.tableHeaders",
                { returnObjects: true },
              ) as string[]
            }
            highlightLastColumn
            rows={
              t(
                "offer:sections.comparison.tableRows",
                { returnObjects: true },
              ) as string[][]
            }
          />
        </MediumBlock>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("offer:sections.security.title")}</H2>

          <Grid columns={2}>
            {
              (
                t(
                  "offer:sections.security.principles",
                  { returnObjects: true },
                ) as {
                  description: string
                  icon: string
                  number: string
                  title: string
                }[]
              ).map(principle => (
                <FeatureCard
                  description={principle.description}
                  icon={principle.icon}
                  key={principle.title}
                  number={principle.number}
                  title={principle.title}
                />
              ))
            }
          </Grid>
        </MediumBlock>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <SmallBlock>
            <H2>{t("offer:sections.packages.title")}</H2>

            <Callout>{t("offer:sections.packages.callout")}</Callout>
          </SmallBlock>

          <Grid columns={1}>
            {
              (
                t(
                  "offer:sections.packages.packages",
                  { returnObjects: true },
                ) as {
                  description: string
                  duration: string
                  forWhom: string
                  icon: string
                  id: string
                  includes: {
                    items: string[]
                    title: string
                  }
                  label: string
                  outcomes: {
                    items: string[]
                    title: string
                  }
                  price: string
                  title: string
                }[]
              ).map(pkg => (
                <ExtendedPackageCard
                  description={pkg.description}
                  duration={pkg.duration}
                  forWhom={pkg.forWhom}
                  icon={pkg.icon}
                  id={pkg.id}
                  includes={
                    {
                      items: pkg.includes.items,
                      title: pkg.includes.title,
                    }
                  }
                  key={pkg.id}
                  label={pkg.label}
                  outcomes={
                    {
                      items: pkg.outcomes.items,
                      title: pkg.outcomes.title,
                    }
                  }
                  price={pkg.price}
                  title={pkg.title}
                />
              ))
            }
          </Grid>

          <CtaCard
            description={t("offer:sections.packages.cta.description")}
            links={
              [
                {
                  description: t("offer:sections.packages.cta.links.0.description"),
                  external: true,
                  href: t("paths:calendar"),
                  label: t("offer:sections.packages.cta.links.0.title"),
                  variant: "primary",
                },
                {
                  description: t("offer:sections.packages.cta.links.1.description"),
                  href: t("paths:process"),
                  label: t("offer:sections.packages.cta.links.1.title"),
                  variant: "secondary",
                },
              ]
            }
            title={t("offer:sections.packages.cta.title")}
            variant="secondary"
          />
        </MediumBlock>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("offer:sections.faq.title")}</H2>

          <Grid columns={1}>
            {
              (
                t(
                  "offer:sections.faq.faqs",
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
          <H2>{t("offer:sections.nextSteps.title")}</H2>

          <Grid columns={2}>
            {
              (
                t(
                  "offer:sections.nextSteps.links",
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
          description={t("offer:sections.nextSteps.cta.description")}
          links={
            [
              {
                description: t("offer:sections.nextSteps.cta.links.0.description"),
                external: true,
                href: t("paths:calendar"),
                label: t("offer:sections.nextSteps.cta.links.0.title"),
                variant: "primary",
              },
              {
                description: t("offer:sections.nextSteps.cta.links.1.description"),
                href: t("paths:contactForm"),
                label: t("offer:sections.nextSteps.cta.links.1.title"),
                variant: "secondary",
              },
            ]
          }
          title={t("offer:sections.nextSteps.cta.title")}
          variant="primary"
        />
      </Section>

      <ContactButton />
    </Content>
  );
};

export { Page };
