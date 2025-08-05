import {
  Badge,
  Callout,
  Content,
  CtaGroup,
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
import { H1, H2, H4 } from "@components/Header";
import { Iteration } from "@components/Iteration";
import { UnorderedList } from "@components/List";
import { PrimaryParagraph } from "@components/Paragraph";
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
          <Badge>{t("process:sections.hero.badge")}</Badge>

          <MediumBlock>
            <H1>{t("process:sections.hero.title")}</H1>

            <H2 className="relative text-neutral-600">
              {t("process:sections.hero.subtitle")}
            </H2>

            <Callout>{t("process:sections.hero.callout")}</Callout>

            <CtaGroup
              links={
                [
                  {
                    description: t("process:sections.hero.cta.0.description"),
                    external: true,
                    href: t("paths:calendar"),
                    label: t("process:sections.hero.cta.0.title"),
                    variant: "primary",
                  },
                  {
                    description: t("process:sections.hero.cta.1.description"),
                    href: t("paths:offer"),
                    label: t("process:sections.hero.cta.1.title"),
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
          <H2>{t("process:sections.fitCheck.title")}</H2>

          <SmallBlock>
            <H4>{t("process:sections.fitCheck.yes.title")}</H4>
            <UnorderedList
              items={
                t(
                  "process:sections.fitCheck.yes.bullets",
                  { returnObjects: true },
                ) as string[]
              }
              list="checkmark"
              variant="primary"
            />
          </SmallBlock>

          <SmallBlock>
            <H4>{t("process:sections.fitCheck.no.title")}</H4>
            <UnorderedList
              items={
                t(
                  "process:sections.fitCheck.no.bullets",
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
        <div>
          {
            (
              t(
                "process:sections.stages.stages",
                { returnObjects: true },
              ) as {
                goal: {
                  description: string
                  title: string
                }
                result: {
                  description: string
                  title: string
                }
                scope: {
                  bullets: string[]
                  title: string
                }
                title: string
              }[]
            ).map((stage, index) => (
              <Iteration key={stage.title} number={index + 1}>
                <MediumBlock className="pb-16">
                  <H2>{stage.title}</H2>

                  <Card>
                    <MediumBlock>
                      <SmallBlock>
                        <H4>{stage.goal.title}</H4>
                        <PrimaryParagraph>
                          {stage.goal.description}
                        </PrimaryParagraph>
                      </SmallBlock>

                      <SmallBlock>
                        <H4>{stage.scope.title}</H4>
                        <UnorderedList
                          items={stage.scope.bullets}
                          list="arrow"
                          variant="primary"
                        />
                      </SmallBlock>

                      <SmallBlock>
                        <H4>{stage.result.title}</H4>
                        <PrimaryParagraph>
                          {stage.result.description}
                        </PrimaryParagraph>
                      </SmallBlock>
                    </MediumBlock>
                  </Card>
                </MediumBlock>
              </Iteration>
            ))
          }
        </div>

        <CtaCard
          description={t("process:sections.stages.cta.description")}
          links={
            [
              {
                description: t("process:sections.stages.cta.links.0.description"),
                href: t("paths:contactForm"),
                label: t("process:sections.stages.cta.links.0.title"),
                variant: "primary",
              },
              {
                description: t("process:sections.stages.cta.links.1.description"),
                href: t("paths:offer"),
                label: t("process:sections.stages.cta.links.1.title"),
                variant: "secondary",
              },
            ]
          }
          title={t("process:sections.stages.cta.title")}
          variant="secondary"
        />

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("process:sections.timeline.title")}</H2>

          <Timeline>
            {
              (
                t(
                  "process:sections.timeline.timeline",
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

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("process:sections.miniCase.title")}</H2>

          <Card>
            <MediumBlock>
              <SmallBlock>
                <H4>{t("process:sections.miniCase.case.problem.title")}</H4>
                <PrimaryParagraph>
                  {t("process:sections.miniCase.case.problem.description")}
                </PrimaryParagraph>
              </SmallBlock>

              <SmallBlock>
                <H4>{t("process:sections.miniCase.case.solution.title")}</H4>
                <PrimaryParagraph>
                  {t("process:sections.miniCase.case.solution.description")}
                </PrimaryParagraph>
              </SmallBlock>

              <SmallBlock>
                <H4>{t("process:sections.miniCase.case.effect.title")}</H4>

                <Grid columns={3}>
                  {
                    (
                      t(
                        "process:sections.miniCase.case.effect.effects",
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

              <Link href={t("paths:productionProject")} variant="cta-link">
                {t("process:sections.miniCase.case.link")}
              </Link>
            </MediumBlock>
          </Card>

          <SectionHint>
            {t("process:sections.miniCase.hint.title")}
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
              {t("process:sections.miniCase.hint.linkTitle")}
            </Link>
          </SectionHint>
        </MediumBlock>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <SmallBlock>
            <H2>{t("process:sections.howIWork.title")}</H2>
            <PrimaryParagraph>
              {t("process:sections.howIWork.description")}
            </PrimaryParagraph>
          </SmallBlock>

          <Grid columns={1}>
            {
              (
                t(
                  "process:sections.howIWork.principles",
                  { returnObjects: true },
                ) as {
                  description: string
                  icon: string
                  title: string
                }[]
              ).map(principle => (
                <TextBox
                  icon={principle.icon}
                  key={principle.title}
                  subtitle={principle.description}
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
          <H2>{t("process:sections.whereItLeads.title")}</H2>

          <Callout>{t("process:sections.whereItLeads.callout")}</Callout>

          <Grid columns={2}>
            {
              (
                t(
                  "process:sections.whereItLeads.effects",
                  { returnObjects: true },
                ) as {
                  description: string
                  icon: string
                  title: string
                }[]
              ).map(effect => (
                <StatusCard
                  description={effect.description}
                  icon={effect.icon}
                  key={effect.title}
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
          <H2>{t("process:sections.faq.title")}</H2>

          <Grid columns={1}>
            {
              (
                t(
                  "process:sections.faq.faqs",
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
          <H2>{t("process:sections.nextSteps.title")}</H2>

          <Grid columns={2}>
            {
              (
                t(
                  "process:sections.nextSteps.links",
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
          description={t("process:sections.nextSteps.cta.description")}
          links={
            [
              {
                description: t("process:sections.nextSteps.cta.links.0.description"),
                external: true,
                href: t("paths:calendar"),
                label: t("process:sections.nextSteps.cta.links.0.title"),
                variant: "primary",
              },
              {
                description: t("process:sections.nextSteps.cta.links.1.description"),
                href: t("paths:contactForm"),
                label: t("process:sections.nextSteps.cta.links.1.title"),
                variant: "secondary",
              },
            ]
          }
          title={t("process:sections.nextSteps.cta.title")}
          variant="primary"
        />
      </Section>

      <ContactButton />
    </Content>
  );
};

export { Page };
