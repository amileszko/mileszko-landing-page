import {
  AvatarImage,
  Badge,
  Callout,
  Content,
  Grid,
  Link,
  Section,
  SectionHint,
  Separator,
  TextBox,
} from "@components";
import { LargeBlock, MediumBlock, SmallBlock } from "@components/Block";
import { ContactButton } from "@components/Button";
import { Card, CtaCard, FeatureCard, StatusCard } from "@components/Card";
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
        <MediumBlock
          className={
            `
              items-start justify-between
              md:flex-row
            `
          }
        >
          <LargeBlock>
            <Badge>{t("aboutMe:sections.hero.badge")}</Badge>

            <MediumBlock>
              <H1>{t("aboutMe:sections.hero.title")}</H1>

              <H2 className="relative text-neutral-600">
                {t("aboutMe:sections.hero.subtitle")}
              </H2>

              <Callout>{t("aboutMe:sections.hero.callout")}</Callout>
            </MediumBlock>
          </LargeBlock>

          <AvatarImage
            alt={t("aboutMe:sections.hero.avatarAlt")}
            src="/avatar.webp"
          />
        </MediumBlock>

        <SectionHint>{t("aboutMe:sections.hero.hint")}</SectionHint>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("aboutMe:sections.whoAmI.title")}</H2>

          <PrimaryParagraph>
            {t("aboutMe:sections.whoAmI.description")}
          </PrimaryParagraph>
        </MediumBlock>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("aboutMe:sections.techPhilosophy.title")}</H2>

          <Callout>{t("aboutMe:sections.techPhilosophy.description")}</Callout>

          <UnorderedList
            items={
              t(
                "aboutMe:sections.techPhilosophy.principles",
                { returnObjects: true },
              ) as string[]
            }
            list="arrow"
            variant="primary"
          />
        </MediumBlock>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("aboutMe:sections.workWith.title")}</H2>

          <PrimaryParagraph>
            {t("aboutMe:sections.workWith.description")}
          </PrimaryParagraph>

          <Grid columns={1}>
            {
              (
                t(
                  "aboutMe:sections.workWith.personas",
                  { returnObjects: true },
                ) as {
                  description: string
                  icon: string
                  link: string
                  linkLabel: string
                  title: string
                }[]
              ).map(persona => (
                <TextBox
                  icon={persona.icon}
                  key={persona.title}
                  link={persona.link}
                  linkLabel={persona.linkLabel}
                  subtitle={persona.description}
                  title={persona.title}
                />
              ))
            }
          </Grid>
        </MediumBlock>

        <MediumBlock>
          <H3>{t("aboutMe:sections.workWith.fitCheck.title")}</H3>

          {
            (
              t(
                "aboutMe:sections.workWith.fitCheck.checks",
                { returnObjects: true },
              ) as {
                description: string
                title: string
              }[]
            ).map(check => (
              <SmallBlock key={check.title}>
                <H4>{check.title}</H4>
                <PrimaryParagraph>{check.description}</PrimaryParagraph>
              </SmallBlock>
            ))
          }
        </MediumBlock>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("aboutMe:sections.styleOfWork.title")}</H2>

          <Grid columns={2}>
            {
              (
                t(
                  "aboutMe:sections.styleOfWork.principles",
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

        <SectionHint>
          {t("aboutMe:sections.styleOfWork.hint.title")}
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
            {t("aboutMe:sections.styleOfWork.hint.linkTitle")}
          </Link>
        </SectionHint>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("aboutMe:sections.timeline.title")}</H2>

          <UnorderedList
            items={
              t(
                "aboutMe:sections.timeline.bullets",
                { returnObjects: true },
              ) as string[]
            }
            list="arrow"
            variant="primary"
          />
        </MediumBlock>

        <SectionHint>
          {t("aboutMe:sections.timeline.hint.title")}
          {" "}
          <Link
            className={
              `
                inline-block
                md:text-base
              `
            }
            href={t("paths:forRecruiters")}
            variant="cta-link"
          >
            {t("aboutMe:sections.timeline.hint.ctaTitle")}
          </Link>
        </SectionHint>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <SmallBlock>
            <H2>{t("aboutMe:sections.proofs.title")}</H2>
            <PrimaryParagraph>
              {t("aboutMe:sections.proofs.description")}
            </PrimaryParagraph>
          </SmallBlock>

          <Grid columns={2}>
            {
              (
                t(
                  "aboutMe:sections.proofs.projects",
                  { returnObjects: true },
                ) as {
                  description: string
                  icon: string
                  title: string
                }[]
              ).map(project => (
                <StatusCard
                  description={project.description}
                  icon={project.icon}
                  key={project.title}
                  title={project.title}
                />
              ))
            }
          </Grid>
        </MediumBlock>

        <CtaCard
          description={t("aboutMe:sections.proofs.cta.description")}
          links={
            [
              {
                description: t("aboutMe:sections.proofs.cta.link.description"),
                href: t("paths:projects"),
                label: t("aboutMe:sections.proofs.cta.link.title"),
                variant: "secondary",
              },
            ]
          }
          title={t("aboutMe:sections.proofs.cta.title")}
          variant="secondary"
        />

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("aboutMe:sections.faq.title")}</H2>

          <Grid columns={1}>
            {
              (
                t(
                  "aboutMe:sections.faq.cards",
                  { returnObjects: true },
                ) as {
                  answer: string
                  question: string
                }[]
              ).map(card => (
                <Card key={card.question}>
                  <SmallBlock>
                    <H4>{card.question}</H4>
                    <PrimaryParagraph>{card.answer}</PrimaryParagraph>
                  </SmallBlock>
                </Card>
              ))
            }
          </Grid>
        </MediumBlock>
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("aboutMe:sections.nextSteps.title")}</H2>

          <Grid columns={2}>
            {
              (
                t(
                  "aboutMe:sections.nextSteps.links",
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
          description={t("aboutMe:sections.nextSteps.cta.description")}
          links={
            [
              {
                description: t("aboutMe:sections.nextSteps.cta.links.0.description"),
                external: true,
                href: t("paths:calendar"),
                label: t("aboutMe:sections.nextSteps.cta.links.0.title"),
                variant: "primary",
              },
              {
                description: t("aboutMe:sections.nextSteps.cta.links.1.description"),
                href: t("paths:contactForm"),
                label: t("aboutMe:sections.nextSteps.cta.links.1.title"),
                variant: "secondary",
              },
            ]
          }
          title={t("aboutMe:sections.nextSteps.cta.title")}
          variant="primary"
        />
      </Section>

      <ContactButton />
    </Content>
  );
};

export { Page };
