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
  SkillBadge,
  TextBox,
} from "@components";
import { LargeBlock, MediumBlock, SmallBlock } from "@components/Block";
import { ContactButton } from "@components/Button";
import { Card, CtaCard, FeatureCard, StatusCard } from "@components/Card";
import { H1, H2, H3, H4 } from "@components/Header";
import { UnorderedList } from "@components/List";
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
          <Badge>{t("forRecruiters:sections.hero.badge")}</Badge>

          <MediumBlock>
            <H1>{t("forRecruiters:sections.hero.title")}</H1>

            <H2 className="relative text-neutral-600">
              {t("forRecruiters:sections.hero.subtitle")}
            </H2>

            <Callout>{t("forRecruiters:sections.hero.callout")}</Callout>

            <CtaGroup
              links={
                [
                  {
                    description: t("forRecruiters:sections.hero.cta.0.description"),
                    external: true,
                    href: t("paths:calendar"),
                    label: t("forRecruiters:sections.hero.cta.0.title"),
                    variant: "primary",
                  },
                  {
                    description: t("forRecruiters:sections.hero.cta.1.description"),
                    download: true,
                    href: t("paths:cv"),
                    label: t("forRecruiters:sections.hero.cta.1.title"),
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
          <H2>{t("forRecruiters:sections.fitCheck.title")}</H2>

          <SmallBlock>
            <H4>{t("forRecruiters:sections.fitCheck.yes.title")}</H4>
            <UnorderedList
              items={
                t(
                  "forRecruiters:sections.fitCheck.yes.bullets",
                  { returnObjects: true },
                ) as string[]
              }
              list="checkmark"
              variant="primary"
            />
          </SmallBlock>

          <SmallBlock>
            <H4>{t("forRecruiters:sections.fitCheck.no.title")}</H4>
            <UnorderedList
              items={
                t(
                  "forRecruiters:sections.fitCheck.no.bullets",
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
          <H2>{t("forRecruiters:sections.tldr.title")}</H2>

          <Grid columns={1}>
            {
              (
                t(
                  "forRecruiters:sections.tldr.tldrs",
                  { returnObjects: true },
                ) as {
                  description: string
                  icon: string
                  title: string
                }[]
              ).map(tldr => (
                <StatusCard
                  description={tldr.description}
                  icon={tldr.icon}
                  key={tldr.title}
                  title={tldr.title}
                />
              ))
            }
          </Grid>

          <CtaCard
            description={t("forRecruiters:sections.tldr.cta.description")}
            links={
              [
                {
                  description: t("forRecruiters:sections.tldr.cta.links.0.description"),
                  external: true,
                  href: t("paths:calendar"),
                  label: t("forRecruiters:sections.tldr.cta.links.0.title"),
                  variant: "primary",
                },
                {
                  description: t("forRecruiters:sections.tldr.cta.links.1.description"),
                  href: `mailto:${t("paths:email")}`,
                  label: t("forRecruiters:sections.tldr.cta.links.1.title"),
                  variant: "secondary",
                },
              ]
            }
            title={t("forRecruiters:sections.tldr.cta.title")}
            variant="secondary"
          />
        </MediumBlock>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("forRecruiters:sections.stack.title")}</H2>

          <PrimaryParagraph>
            {t("forRecruiters:sections.stack.description")}
          </PrimaryParagraph>

          {
            (
              t(
                "forRecruiters:sections.stack.categories",
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
          {t("forRecruiters:sections.stack.hint.title")}
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
            {t("forRecruiters:sections.stack.hint.linkTitle")}
          </Link>
        </SectionHint>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("forRecruiters:sections.effects.title")}</H2>

          <Grid columns={2}>
            {
              (
                t(
                  "forRecruiters:sections.effects.effects",
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
          <H2>{t("forRecruiters:sections.timeline.title")}</H2>

          <Timeline>
            {
              (
                t(
                  "forRecruiters:sections.timeline.timeline",
                  { returnObjects: true },
                ) as {
                  date: string
                  icon: string
                  subtitle: string
                  title: string
                }[]
              ).map(item => (
                <TimelineItem
                  date={item.date}
                  icon={item.icon}
                  key={item.title}
                  subtitle={item.subtitle}
                  title={item.title}
                />
              ))
            }
          </Timeline>
        </MediumBlock>
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("forRecruiters:sections.certifications.title")}</H2>

          <MediumBlock>
            <H3>
              {
                t("forRecruiters:sections.certifications.certifications.title")
              }
            </H3>
            <PrimaryParagraph>
              {
                t("forRecruiters:sections.certifications.certifications.description")
              }
            </PrimaryParagraph>

            <SmallBlock>
              <Grid columns={1}>
                {
                  (
                    t(
                      "forRecruiters:sections.certifications.certifications.certifications",
                      { returnObjects: true },
                    ) as {
                      icon: string
                      subtitle: string
                      title: string
                    }[]
                  ).map(certification => (
                    <TextBox
                      icon={certification.icon}
                      key={certification.title}
                      subtitle={certification.subtitle}
                      title={certification.title}
                    />
                  ))
                }
              </Grid>
            </SmallBlock>
          </MediumBlock>

        </MediumBlock>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("forRecruiters:sections.github.title")}</H2>

          <Grid columns={2}>
            <TextBox
              external={true}
              icon={t("forRecruiters:sections.github.cta.0.icon")}
              link={t("paths:github")}
              linkLabel={t("forRecruiters:sections.github.cta.0.linkLabel")}
              subtitle={t("forRecruiters:sections.github.cta.0.subtitle")}
              title={t("forRecruiters:sections.github.cta.0.title")}
            />
            <TextBox
              icon={t("forRecruiters:sections.github.cta.1.icon")}
              link={t("paths:projects")}
              linkLabel={t("forRecruiters:sections.github.cta.1.linkLabel")}
              subtitle={t("forRecruiters:sections.github.cta.1.subtitle")}
              title={t("forRecruiters:sections.github.cta.1.title")}
            />
          </Grid>
        </MediumBlock>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("forRecruiters:sections.where.title")}</H2>

          <Grid columns={2}>
            {
              (
                t(
                  "forRecruiters:sections.where.where",
                  { returnObjects: true },
                ) as {
                  description: string
                  icon: string
                  title: string
                }[]
              ).map(item => (
                <StatusCard
                  description={item.description}
                  icon={item.icon}
                  key={item.title}
                  title={item.title}
                />
              ))
            }
          </Grid>
        </MediumBlock>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("forRecruiters:sections.faq.title")}</H2>

          <Grid columns={1}>
            {
              (
                t(
                  "forRecruiters:sections.faq.faqs",
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
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("forRecruiters:sections.contact.title")}</H2>

          <Callout>{t("forRecruiters:sections.contact.callout")}</Callout>
        </MediumBlock>

        <Grid columns={2}>
          <CtaCard
            description={t("forRecruiters:sections.contact.cta.0.description")}
            icon={t("forRecruiters:sections.contact.cta.0.icon")}
            links={
              [
                {
                  description: t("forRecruiters:sections.contact.cta.0.info"),
                  external: true,
                  href: t("paths:calendar"),
                  label: t("forRecruiters:sections.contact.cta.0.linkLabel"),
                  variant: "primary",
                },
              ]
            }
            title={t("forRecruiters:sections.contact.cta.0.title")}
            variant="primary"
          />
          <CtaCard
            description={t("forRecruiters:sections.contact.cta.1.description")}
            icon={t("forRecruiters:sections.contact.cta.1.icon")}
            links={
              [
                {
                  description: t("forRecruiters:sections.contact.cta.1.info"),
                  href: `mailto:${t("paths:email")}`,
                  label: t("forRecruiters:sections.contact.cta.1.linkLabel"),
                  variant: "secondary",
                },
              ]
            }
            title={t("forRecruiters:sections.contact.cta.1.title")}
            variant="primary"
          />
        </Grid>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("forRecruiters:sections.links.title")}</H2>

          <Grid columns={2}>
            {
              (
                t(
                  "forRecruiters:sections.links.links",
                  { returnObjects: true },
                ) as {
                  download?: boolean
                  external?: boolean
                  icon: string
                  link: string
                  linkLabel: string
                  subtitle: string
                  title: string
                }[]
              ).map(link => (
                <TextBox
                  download={link.download}
                  external={link.external}
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
