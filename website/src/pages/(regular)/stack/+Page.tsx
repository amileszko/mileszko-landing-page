import {
  Badge,
  Callout,
  Card,
  Content,
  Grid,
  Section,
  SectionHint,
  Separator,
  SkillBadge,
  TextBox,
} from "@components";
import { LargeBlock, MediumBlock, SmallBlock } from "@components/Block";
import { ContactButton } from "@components/Button";
import { CtaCard, FeatureCard } from "@components/Card";
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
          <Badge>{t("stack:sections.hero.badge")}</Badge>

          <MediumBlock>
            <H1>{t("stack:sections.hero.title")}</H1>

            <H2 className="relative text-neutral-600">
              {t("stack:sections.hero.subtitle")}
            </H2>

            <Callout>{t("stack:sections.hero.callout")}</Callout>
          </MediumBlock>
        </LargeBlock>

        <SectionHint>{t("stack:sections.hero.hint")}</SectionHint>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("stack:sections.philosophy.title")}</H2>

          <Callout>{t("stack:sections.philosophy.callout")}</Callout>

          <UnorderedList
            items={
              t(
                "stack:sections.philosophy.principles",
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
          <H2>{t("stack:sections.technologies.title")}</H2>

          <PrimaryParagraph>
            {t("stack:sections.technologies.description")}
          </PrimaryParagraph>

          <LargeBlock>
            {
              (
                t(
                  "stack:sections.technologies.categories",
                  { returnObjects: true },
                ) as {
                  description: string
                  effects: {
                    effects: {
                      description: string
                      icon: string
                      number: string
                      title: string
                    }[]
                    title: string
                  }
                  technologies: {
                    technologies: { icon: string
                      title: string }[]
                    title: string
                  }
                  title: string
                  usages: {
                    title: string
                    usages: { icon: string
                      subtitle: string
                      title: string }[]
                  }
                }[]
              ).map(block => (
                <Card key={block.title}>
                  <MediumBlock>
                    <SmallBlock>
                      <H3>{block.title}</H3>
                      <PrimaryParagraph>{block.description}</PrimaryParagraph>
                    </SmallBlock>

                    <SmallBlock>
                      <H4>{block.technologies.title}</H4>
                      <div className="flex flex-wrap gap-4">
                        {
                          block.technologies.technologies.map(item => (
                            <SkillBadge
                              icon={item.icon}
                              key={item.title}
                              title={item.title}
                            />
                          ))
                        }
                      </div>
                    </SmallBlock>

                    <SmallBlock>
                      <H4>{block.effects.title}</H4>
                      <Grid columns={3}>
                        {
                          block.effects.effects.map(item => (
                            <FeatureCard
                              description={item.description}
                              icon={item.icon}
                              key={item.title}
                              number={item.number}
                              title={item.title}
                            />
                          ))
                        }
                      </Grid>
                    </SmallBlock>

                    <SmallBlock>
                      <H4>{block.usages.title}</H4>
                      <Grid columns={2}>
                        {
                          block.usages.usages.map(item => (
                            <TextBox
                              icon={item.icon}
                              key={item.title}
                              subtitle={item.subtitle}
                              title={item.title}
                            />
                          ))
                        }
                      </Grid>
                    </SmallBlock>
                  </MediumBlock>
                </Card>
              ))
            }
          </LargeBlock>
        </MediumBlock>

        <CtaCard
          description={t("stack:sections.technologies.cta.description")}
          links={
            [
              {
                description: t("stack:sections.technologies.cta.link.description"),
                href: t("paths:projects"),
                label: t("stack:sections.technologies.cta.link.title"),
                variant: "secondary",
              },
            ]
          }
          title={t("stack:sections.technologies.cta.title")}
          variant="secondary"
        />

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("stack:sections.faq.title")}</H2>

          <Grid columns={1}>
            {
              (
                t(
                  "stack:sections.faq.questions",
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
          <H2>{t("stack:sections.nextSteps.title")}</H2>

          <Grid columns={2}>
            {
              (
                t(
                  "stack:sections.nextSteps.links",
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
          description={t("stack:sections.nextSteps.cta.description")}
          links={
            [
              {
                description: t("stack:sections.nextSteps.cta.links.0.description"),
                external: true,
                href: t("paths:calendar"),
                label: t("stack:sections.nextSteps.cta.links.0.title"),
                variant: "primary",
              },
              {
                description: t("stack:sections.nextSteps.cta.links.1.description"),
                href: t("paths:contactForm"),
                label: t("stack:sections.nextSteps.cta.links.1.title"),
                variant: "secondary",
              },
            ]
          }
          title={t("stack:sections.nextSteps.cta.title")}
          variant="primary"
        />
      </Section>

      <ContactButton />
    </Content>
  );
};

export { Page };
