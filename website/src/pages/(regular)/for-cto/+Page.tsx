import {
  Badge,
  Callout,
  Card,
  Content,
  CtaGroup,
  Grid,
  Link,
  Section,
  SectionHint,
  Separator,
  SkillBadge,
  TextBox,
} from "@components";
import { LargeBlock, MediumBlock, SmallBlock } from "@components/Block";
import { ContactButton } from "@components/Button";
import { CtaCard, FeatureCard, StatusCard } from "@components/Card";
import { H1, H2, H4 } from "@components/Header";
import { PrimaryParagraph, SecondaryParagraph } from "@components/Paragraph";
import { Timeline, TimelineItem } from "@components/Timeline";
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
          <Badge>{t("forCto:sections.hero.badge")}</Badge>

          <MediumBlock>
            <H1>{t("forCto:sections.hero.title")}</H1>

            <H2 className="relative text-neutral-600">
              {t("forCto:sections.hero.subtitle")}
            </H2>

            <Callout>{t("forCto:sections.hero.callout")}</Callout>

            <CtaGroup
              links={
                [
                  {
                    description: t("forCto:sections.hero.cta.0.description"),
                    external: true,
                    href: t("paths:calendar"),
                    label: t("forCto:sections.hero.cta.0.title"),
                    variant: "primary",
                  },
                  {
                    description: t("forCto:sections.hero.cta.1.description"),
                    href: t("paths:offer"),
                    label: t("forCto:sections.hero.cta.1.title"),
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
          <H2>{t("forCto:sections.problems.title")}</H2>

          <Grid columns={1}>
            {
              (
                t(
                  "forCto:sections.problems.problems",
                  { returnObjects: true },
                ) as {
                  description: string
                  icon: string
                  title: string
                }[]
              ).map(problem => (
                <TextBox
                  icon={problem.icon}
                  key={problem.title}
                  subtitle={problem.description}
                  title={problem.title}
                />
              ))
            }
          </Grid>

          <CtaCard
            description={t("forCto:sections.problems.cta.description")}
            links={
              [
                {
                  description: t("forCto:sections.problems.cta.link.description"),
                  href: t("paths:projects"),
                  label: t("forCto:sections.problems.cta.link.title"),
                  variant: "secondary",
                },
              ]
            }
            title={t("forCto:sections.problems.cta.title")}
            variant="secondary"
          />
        </MediumBlock>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("forCto:sections.howIHelp.title")}</H2>

          <Grid columns={2}>
            {
              (
                t(
                  "forCto:sections.howIHelp.howIHelp",
                  { returnObjects: true },
                ) as {
                  icon: string
                  subtitle: string
                  title: string
                }[]
              ).map(howIHelp => (
                <StatusCard
                  description={howIHelp.subtitle}
                  icon={howIHelp.icon}
                  key={howIHelp.title}
                  title={howIHelp.title}
                />
              ))
            }
          </Grid>
        </MediumBlock>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("forCto:sections.miniCase.title")}</H2>

          <Card>
            <MediumBlock>
              <SmallBlock>
                <H4>{t("forCto:sections.miniCase.miniCase.problem.title")}</H4>
                <PrimaryParagraph>
                  {t("forCto:sections.miniCase.miniCase.problem.description")}
                </PrimaryParagraph>
              </SmallBlock>

              <SmallBlock>
                <H4>{t("forCto:sections.miniCase.miniCase.solution.title")}</H4>
                <PrimaryParagraph>
                  {t("forCto:sections.miniCase.miniCase.solution.description")}
                </PrimaryParagraph>
              </SmallBlock>

              <SmallBlock>
                <H4>{t("forCto:sections.miniCase.miniCase.effects.title")}</H4>

                <Grid columns={3}>
                  {
                    (
                      t(
                        "forCto:sections.miniCase.miniCase.effects.effects",
                        { returnObjects: true },
                      ) as {
                        description: string
                        icon: string
                        number: string
                        title: string
                      }[]
                    ).map(effect => (
                      <FeatureCard
                        description={effect.description}
                        icon={effect.icon}
                        key={effect.title}
                        number={effect.number}
                        title={effect.title}
                      />
                    ))
                  }
                </Grid>
              </SmallBlock>

              <Link href={t("paths:apetitioProject")} variant="cta-link">
                {t("forCto:sections.miniCase.miniCase.link")}
              </Link>
            </MediumBlock>
          </Card>

          <SectionHint>
            {t("forCto:sections.miniCase.hint.title")}
            {" "}
            <Link
              className={
                `
                  inline-block
                  md:text-base
                `
              }
              href={t("paths:projects")}
              variant="cta-link"
            >
              {t("forCto:sections.miniCase.hint.linkTitle")}
            </Link>
          </SectionHint>
        </MediumBlock>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("forCto:sections.process.title")}</H2>

          <Timeline>
            {
              (
                t(
                  "forCto:sections.process.timeline",
                  { returnObjects: true },
                ) as {
                  icon: string
                  subtitle: string
                  time: string
                  title: string
                }[]
              ).map(timeline => (
                <TimelineItem
                  date={timeline.time}
                  icon={timeline.icon}
                  key={timeline.title}
                  subtitle={timeline.subtitle}
                  title={timeline.title}
                />
              ))
            }
          </Timeline>
        </MediumBlock>

        <CtaCard
          description={t("forCto:sections.process.cta.description")}
          links={
            [
              {
                description: t("forCto:sections.process.cta.links.0.description"),
                href: t("paths:offer"),
                label: t("forCto:sections.process.cta.links.0.title"),
                variant: "secondary",
              },
              {
                description: t("forCto:sections.process.cta.links.1.description"),
                href: t("paths:process"),
                label: t("forCto:sections.process.cta.links.1.title"),
                variant: "secondary",
              },
            ]
          }
          title={t("forCto:sections.process.cta.title")}
          variant="secondary"
        />

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("forCto:sections.stack.title")}</H2>

          <PrimaryParagraph>
            {t("forCto:sections.stack.description")}
          </PrimaryParagraph>

          {
            (
              t(
                "forCto:sections.stack.categories",
                { returnObjects: true },
              ) as {
                description: string
                technologies: {
                  icon: string
                  title: string
                }[]
                title: string
              }[]
            ).map(category => (
              <MediumBlock key={category.title}>
                <SmallBlock>
                  <H4>{category.title}</H4>
                  <SecondaryParagraph>
                    {category.description}
                  </SecondaryParagraph>
                </SmallBlock>
                <div className="flex flex-wrap gap-4">
                  {
                    category.technologies.map(technology => (
                      <SkillBadge
                        icon={technology.icon}
                        key={technology.title}
                        title={technology.title}
                      />
                    ))
                  }
                </div>
              </MediumBlock>
            ))
          }
        </MediumBlock>

        <SectionHint>
          {t("forCto:sections.stack.hint.title")}
          {" "}
          <Link
            className={
              `
                inline-block
                md:text-base
              `
            }
            href={t("paths:stack")}
            variant="cta-link"
          >
            {t("forCto:sections.stack.hint.linkTitle")}
          </Link>
        </SectionHint>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("forCto:sections.effects.title")}</H2>

          <Grid columns={2}>
            {
              (
                t(
                  "forCto:sections.effects.effects",
                  { returnObjects: true },
                ) as {
                  description: string
                  icon: string
                  number: string
                  title: string
                }[]
              ).map(effect => (
                <FeatureCard
                  description={effect.description}
                  icon={effect.icon}
                  key={effect.title}
                  number={effect.number}
                  title={effect.title}
                />
              ))
            }
          </Grid>
        </MediumBlock>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("forCto:sections.faq.title")}</H2>

          <Grid columns={1}>
            {
              (
                t(
                  "forCto:sections.faq.faqs",
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
          <H2>{t("forCto:sections.contact.title")}</H2>

          <Callout>{t("forCto:sections.contact.callout")}</Callout>
        </MediumBlock>

        <Grid columns={2}>
          <CtaCard
            description={t("forCto:sections.contact.cta.0.description")}
            icon={t("forCto:sections.contact.cta.0.icon")}
            links={
              [
                {
                  description: t("forCto:sections.contact.cta.0.info"),
                  external: true,
                  href: t("paths:calendar"),
                  label: t("forCto:sections.contact.cta.0.linkLabel"),
                  variant: "primary",
                },
              ]
            }
            title={t("forCto:sections.contact.cta.0.title")}
            variant="primary"
          />
          <CtaCard
            description={t("forCto:sections.contact.cta.1.description")}
            icon={t("forCto:sections.contact.cta.1.icon")}
            links={
              [
                {
                  description: t("forCto:sections.contact.cta.1.info"),
                  href: t("paths:contactForm"),
                  label: t("forCto:sections.contact.cta.1.linkLabel"),
                  variant: "secondary",
                },
              ]
            }
            title={t("forCto:sections.contact.cta.1.title")}
            variant="primary"
          />
        </Grid>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("forCto:sections.links.title")}</H2>

          <Grid columns={2}>
            {
              (
                t(
                  "forCto:sections.links.links",
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

      <ContactButton />
    </Content>
  );
};

export { Page };
