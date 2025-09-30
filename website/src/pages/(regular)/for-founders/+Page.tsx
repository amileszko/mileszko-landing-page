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
          <Badge>{t("forFounders:sections.hero.badge")}</Badge>

          <MediumBlock>
            <H1>{t("forFounders:sections.hero.title")}</H1>

            <H2 className="relative text-neutral-600">
              {t("forFounders:sections.hero.subtitle")}
            </H2>

            <Callout>{t("forFounders:sections.hero.callout")}</Callout>

            <CtaGroup
              links={
                [
                  {
                    description: t("forFounders:sections.hero.cta.0.description"),
                    external: true,
                    href: t("paths:calendar"),
                    label: t("forFounders:sections.hero.cta.0.title"),
                    variant: "primary",
                  },
                  {
                    description: t("forFounders:sections.hero.cta.1.description"),
                    href: t("paths:offer"),
                    label: t("forFounders:sections.hero.cta.1.title"),
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
          <H2>{t("forFounders:sections.problems.title")}</H2>

          <Grid columns={1}>
            {
              (
                t(
                  "forFounders:sections.problems.problems",
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
        </MediumBlock>

        <CtaCard
          description={t("forFounders:sections.problems.cta.description")}
          links={
            [
              {
                description: t("forFounders:sections.problems.cta.link.description"),
                href: t("paths:process"),
                label: t("forFounders:sections.problems.cta.link.title"),
                variant: "secondary",
              },
            ]
          }
          title={t("forFounders:sections.problems.cta.title")}
        />

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("forFounders:sections.solutions.title")}</H2>

          <Grid columns={2}>
            {
              (
                t(
                  "forFounders:sections.solutions.solutions",
                  { returnObjects: true },
                ) as {
                  description: string
                  icon: string
                  title: string
                }[]
              ).map(solution => (
                <StatusCard
                  description={solution.description}
                  icon={solution.icon}
                  key={solution.title}
                  title={solution.title}
                />
              ))
            }
          </Grid>
        </MediumBlock>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("forFounders:sections.caseStudy.title")}</H2>

          <Card>
            <MediumBlock>
              <SmallBlock>
                <H4>
                  {t("forFounders:sections.caseStudy.caseStudy.problem.title")}
                </H4>
                <PrimaryParagraph>
                  {
                    t("forFounders:sections.caseStudy.caseStudy.problem.description")
                  }
                </PrimaryParagraph>
              </SmallBlock>

              <SmallBlock>
                <H4>
                  {t("forFounders:sections.caseStudy.caseStudy.solution.title")}
                </H4>
                <PrimaryParagraph>
                  {
                    t("forFounders:sections.caseStudy.caseStudy.solution.description")
                  }
                </PrimaryParagraph>
              </SmallBlock>

              <SmallBlock>
                <H4>
                  {t("forFounders:sections.caseStudy.caseStudy.effects.title")}
                </H4>

                <Grid columns={3}>
                  {
                    (
                      t(
                        "forFounders:sections.caseStudy.caseStudy.effects.effects",
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

              <Link href={t("paths:retrivisProject")} variant="cta-link">
                {t("forFounders:sections.caseStudy.caseStudy.link")}
              </Link>
            </MediumBlock>
          </Card>

          <SectionHint>
            {t("forFounders:sections.caseStudy.hint.title")}
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
              {t("forFounders:sections.caseStudy.hint.linkTitle")}
            </Link>
          </SectionHint>
        </MediumBlock>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("forFounders:sections.process.title")}</H2>

          <Timeline>
            {
              (
                t(
                  "forFounders:sections.process.timeline",
                  { returnObjects: true },
                ) as {
                  icon: string
                  subtitle: string
                  time: string
                  title: string
                }[]
              ).map(item => (
                <TimelineItem
                  date={item.time}
                  icon={item.icon}
                  key={item.title}
                  subtitle={item.subtitle}
                  title={item.title}
                />
              ))
            }
          </Timeline>
        </MediumBlock>

        <CtaCard
          description={t("forFounders:sections.process.cta.description")}
          links={
            [
              {
                description: t("forFounders:sections.process.cta.links.0.description"),
                href: t("paths:offer"),
                label: t("forFounders:sections.process.cta.links.0.title"),
                variant: "secondary",
              },
              {
                description: t("forFounders:sections.process.cta.links.1.description"),
                href: t("paths:process"),
                label: t("forFounders:sections.process.cta.links.1.title"),
                variant: "secondary",
              },
            ]
          }
          title={t("forFounders:sections.process.cta.title")}
          variant="secondary"
        />

        <SectionHint>
          {t("forFounders:sections.process.hint.title")}
        </SectionHint>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("forFounders:sections.stack.title")}</H2>

          <PrimaryParagraph>
            {t("forFounders:sections.stack.description")}
          </PrimaryParagraph>

          {
            (
              t(
                "forFounders:sections.stack.categories",
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
          {t("forFounders:sections.stack.hint.title")}
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
            {t("forFounders:sections.stack.hint.linkTitle")}
          </Link>
        </SectionHint>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("forFounders:sections.effects.title")}</H2>

          <Grid columns={2}>
            {
              (
                t(
                  "forFounders:sections.effects.effects",
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
          <H2>{t("forFounders:sections.faq.title")}</H2>

          <Grid columns={1}>
            {
              (
                t(
                  "forFounders:sections.faq.faqs",
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
          <H2>{t("forFounders:sections.contact.title")}</H2>

          <Callout>{t("forFounders:sections.contact.callout")}</Callout>
        </MediumBlock>

        <Grid columns={2}>
          <CtaCard
            description={t("forFounders:sections.contact.cta.0.description")}
            icon={t("forFounders:sections.contact.cta.0.icon")}
            links={
              [
                {
                  description: t("forFounders:sections.contact.cta.0.info"),
                  external: true,
                  href: t("paths:calendar"),
                  label: t("forFounders:sections.contact.cta.0.linkLabel"),
                  variant: "primary",
                },
              ]
            }
            title={t("forFounders:sections.contact.cta.0.title")}
            variant="primary"
          />
          <CtaCard
            description={t("forFounders:sections.contact.cta.1.description")}
            icon={t("forFounders:sections.contact.cta.1.icon")}
            links={
              [
                {
                  description: t("forFounders:sections.contact.cta.1.info"),
                  href: t("paths:contactForm"),
                  label: t("forFounders:sections.contact.cta.1.linkLabel"),
                  variant: "secondary",
                },
              ]
            }
            title={t("forFounders:sections.contact.cta.1.title")}
            variant="primary"
          />
        </Grid>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("forFounders:sections.links.title")}</H2>

          <Grid columns={2}>
            {
              (
                t(
                  "forFounders:sections.links.links",
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
