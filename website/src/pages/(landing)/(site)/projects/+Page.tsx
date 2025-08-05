import {
  Badge,
  Callout,
  Card,
  Content,
  Grid,
  Section,
  Separator,
  SkillBadge,
  StatusCard,
  TextBox,
} from "@components";
import { LargeBlock, MediumBlock, SmallBlock } from "@components/Block";
import { ContactButton } from "@components/Button";
import { CtaCard, FeatureCard } from "@components/Card";
import { H1, H2, H3, H4 } from "@components/Header";
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
          <Badge>{t("projects:sections.hero.badge")}</Badge>

          <MediumBlock>
            <H1>{t("projects:sections.hero.title")}</H1>

            <H2 className="relative text-neutral-600">
              {t("projects:sections.hero.subtitle")}
            </H2>

            <Callout>{t("projects:sections.hero.callout")}</Callout>
          </MediumBlock>

          <MediumBlock>
            <Grid columns={2}>
              {
                (
                  t(
                    "projects:sections.hero.highlights",
                    { returnObjects: true },
                  ) as {
                    description: string
                    icon: string
                    number: string
                    title: string
                  }[]
                ).map(highlight => (
                  <StatusCard
                    description={highlight.description}
                    icon={highlight.icon}
                    key={highlight.title}
                    title={highlight.title}
                  />
                ))
              }
            </Grid>

            <CtaCard
              description={t("projects:sections.hero.cta.description")}
              links={
                [
                  {
                    description: t("projects:sections.hero.cta.links.0.description"),
                    external: true,
                    href: t("paths:calendar"),
                    label: t("projects:sections.hero.cta.links.0.title"),
                    variant: "primary",
                  },
                  {
                    description: t("projects:sections.hero.cta.links.1.description"),
                    href: t("paths:contactForm"),
                    label: t("projects:sections.hero.cta.links.1.title"),
                    variant: "secondary",
                  },
                ]
              }
              title={t("projects:sections.hero.cta.title")}
              variant="secondary"
            />
          </MediumBlock>
        </LargeBlock>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("projects:sections.projects.title")}</H2>

          <LargeBlock>
            {
              (
                t(
                  "projects:sections.projects.projects",
                  { returnObjects: true },
                ) as {
                  effects: {
                    effects: {
                      description: string
                      icon: string
                      number: string
                      title: string
                    }[]
                    title: string
                  }
                  id: string
                  industry: string
                  keyLearning: {
                    description: string
                    title: string
                  }
                  problem: {
                    description: string
                    title: string
                  }
                  stack: {
                    stack: {
                      icon: string
                      title: string
                    }[]
                    title: string
                  }
                  title: string
                  whatIDid: {
                    description: string
                    title: string
                  }
                }[]
              ).map(project => (
                <Card id={project.id} key={project.id}>
                  <MediumBlock>
                    <Badge>{project.industry}</Badge>
                    <H3>{project.title}</H3>

                    <SmallBlock>
                      <H4>{project.problem.title}</H4>
                      <PrimaryParagraph>
                        {project.problem.description}
                      </PrimaryParagraph>
                    </SmallBlock>

                    <SmallBlock>
                      <H4>{project.whatIDid.title}</H4>
                      <PrimaryParagraph>
                        {project.whatIDid.description}
                      </PrimaryParagraph>
                    </SmallBlock>

                    <SmallBlock>
                      <H4>{project.effects.title}</H4>
                      <Grid columns={3}>
                        {
                          project.effects.effects.map(effect => (
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

                    <SmallBlock>
                      <H4>{project.stack.title}</H4>
                      <div className="flex flex-wrap gap-2">
                        {
                          project.stack.stack.map(tech => (
                            <SkillBadge
                              icon={tech.icon}
                              key={tech.title}
                              title={tech.title}
                            />
                          ))
                        }
                      </div>
                    </SmallBlock>

                    <SmallBlock>
                      <H4>{project.keyLearning.title}</H4>
                      <Callout>{project.keyLearning.description}</Callout>
                    </SmallBlock>
                  </MediumBlock>
                </Card>
              ))
            }
          </LargeBlock>
        </MediumBlock>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("projects:sections.faq.title")}</H2>

          <Grid columns={1}>
            {
              (
                t(
                  "projects:sections.faq.faqs",
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
          <H2>{t("projects:sections.contact.title")}</H2>

          <Callout>{t("projects:sections.contact.callout")}</Callout>
        </MediumBlock>

        <Grid columns={2}>
          <CtaCard
            description={t("projects:sections.contact.cta.0.description")}
            icon={t("projects:sections.contact.cta.0.icon")}
            links={
              [
                {
                  description: t("projects:sections.contact.cta.0.info"),
                  external: true,
                  href: t("paths:calendar"),
                  label: t("projects:sections.contact.cta.0.linkLabel"),
                  variant: "primary",
                },
              ]
            }
            title={t("projects:sections.contact.cta.0.title")}
            variant="primary"
          />
          <CtaCard
            description={t("projects:sections.contact.cta.1.description")}
            icon={t("projects:sections.contact.cta.1.icon")}
            links={
              [
                {
                  description: t("projects:sections.contact.cta.1.info"),
                  href: t("paths:contactForm"),
                  label: t("projects:sections.contact.cta.1.linkLabel"),
                  variant: "secondary",
                },
              ]
            }
            title={t("projects:sections.contact.cta.1.title")}
            variant="primary"
          />
        </Grid>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("projects:sections.links.title")}</H2>

          <Grid columns={2}>
            {
              (
                t(
                  "projects:sections.links.links",
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
