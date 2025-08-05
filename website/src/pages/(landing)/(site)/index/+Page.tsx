import {
  AvatarImage,
  Callout,
  Card,
  Content,
  CtaGroup,
  Grid,
  Link,
  Section,
  SectionHint,
  Separator,
  Status,
  TextBox,
  VideoTeaser,
} from "@components";
import { LargeBlock, MediumBlock, SmallBlock } from "@components/Block";
import { ContactButton } from "@components/Button";
import {
  BlogCard,
  CtaCard,
  FeatureCard,
  NumbersCard,
  PackageCard,
  ProjectCard,
  StatusCard,
} from "@components/Card";
import { H1, H2, H3, H4 } from "@components/Header";
import { PrimaryParagraph } from "@components/Paragraph";
import { type JSX, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";

const Page = (): JSX.Element => {
  const { locale } = usePageContext();
  const { t } = useTranslation(
    undefined,
    { lng: locale },
  );

  const articles = useMemo(
    () => {
      return Object.values(t(
        "articles:articles",
        { returnObjects: true },
      ) as Record<string,
        { article:
        {
          category: string
          date: string
          description: string
          link: string
          linkLabel: string
          readingTime: string
          title: string
        } }>)
        .map(article => article.article)
        .reverse()
        .slice(
          0,
          3,
        );
    },
    [t],
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
            <Status>{t("home:sections.hero.badge")}</Status>

            <MediumBlock>
              <H1>{t("home:sections.hero.title")}</H1>

              <H2 className="relative text-neutral-600">
                {t("home:sections.hero.subtitle")}
              </H2>

              <Callout>{t("home:sections.hero.callout")}</Callout>

              <CtaGroup
                links={
                  [
                    {
                      description: t("home:sections.hero.cta.0.description"),
                      external: true,
                      href: t("paths:calendar"),
                      label: t("home:sections.hero.cta.0.title"),
                      variant: "primary",
                    },
                    {
                      description: t("home:sections.hero.cta.1.description"),
                      href: t("paths:offer"),
                      label: t("home:sections.hero.cta.1.title"),
                      variant: "secondary",
                    },
                  ]
                }
              />
            </MediumBlock>

            <SmallBlock>
              <H3>{t("home:sections.hero.bio.title")}</H3>
              <H4>{t("home:sections.hero.bio.subtitle")}</H4>
              <PrimaryParagraph>
                {t("home:sections.hero.bio.description")}
              </PrimaryParagraph>
            </SmallBlock>
          </LargeBlock>

          <AvatarImage
            alt={t("home:sections.hero.avatarAlt")}
            src="/avatar.webp"
          />
        </MediumBlock>

        <Card>
          <MediumBlock>
            <H3>{t("home:sections.hero.howIWork.title")}</H3>

            <VideoTeaser />

            <Link
              href="/intro.mp4"
              variant="cta-link"
            >
              {t("home:sections.hero.howIWork.linkTitle")}
            </Link>
          </MediumBlock>
        </Card>

        <SectionHint>
          {t("home:sections.hero.hint.title")}
        </SectionHint>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("home:sections.numbers.title")}</H2>

          <Grid columns={2}>
            {
              (
                t(
                  "home:sections.numbers.numbers",
                  { returnObjects: true },
                ) as {
                  number: string
                  subtitle: string
                  title: string
                }[]
              ).map(number => (
                <NumbersCard
                  key={number.number}
                  number={number.number}
                  subtitle={number.subtitle}
                  title={number.title}
                />
              ))
            }
          </Grid>
        </MediumBlock>

        <MediumBlock>
          <SmallBlock>
            <H3>{t("home:sections.numbers.industries.title")}</H3>

            <PrimaryParagraph>
              {t("home:sections.numbers.industries.description")}
            </PrimaryParagraph>
          </SmallBlock>

          <Grid columns={1}>
            {
              (
                t(
                  "home:sections.numbers.industries.industries",
                  { returnObjects: true },
                ) as {
                  icon: string
                  subtitle: string
                  title: string
                }[]
              ).map(industry => (
                <TextBox
                  icon={industry.icon}
                  key={industry.title}
                  subtitle={industry.subtitle}
                  title={industry.title}
                />
              ))
            }
          </Grid>
        </MediumBlock>

        <CtaCard
          description={t("home:sections.numbers.cta.description")}
          links={
            [
              {
                description: t("home:sections.numbers.cta.link.description"),
                href: t("paths:projects"),
                label: t("home:sections.numbers.cta.link.title"),
                variant: "secondary",
              },
            ]
          }
          title={t("home:sections.numbers.cta.title")}
          variant="secondary"
        />

        <MediumBlock>
          <H3>{t("home:sections.numbers.now.title")}</H3>

          <Grid columns={1}>
            {
              (
                t(
                  "home:sections.numbers.now.statuses",
                  { returnObjects: true },
                ) as {
                  description: string
                  icon: string
                  title: string
                }[]
              ).map(status => (
                <StatusCard
                  description={status.description}
                  icon={status.icon}
                  key={status.title}
                  title={status.title}
                />
              ))
            }
          </Grid>
        </MediumBlock>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("home:sections.projects.title")}</H2>

          <PrimaryParagraph>
            {t("home:sections.projects.description")}
          </PrimaryParagraph>

          <Grid columns={2}>
            {
              (
                t(
                  "home:sections.projects.projects",
                  { returnObjects: true },
                ) as {
                  category: string
                  link: string
                  linkLabel: string
                  subtitle: string
                  title: string
                }[]
              ).map(project => (
                <ProjectCard
                  category={project.category}
                  key={project.title}
                  link={project.link}
                  linkLabel={project.linkLabel}
                  subtitle={project.subtitle}
                  title={project.title}
                />
              ))
            }
          </Grid>
        </MediumBlock>

        <CtaCard
          description={t("home:sections.projects.cta.description")}
          links={
            [
              {
                description: t("home:sections.projects.cta.link.description"),
                href: t("paths:projects"),
                label: t("home:sections.projects.cta.link.title"),
                variant: "secondary",
              },
            ]
          }
          title={t("home:sections.projects.cta.title")}
          variant="secondary"
        />

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("home:sections.packages.title")}</H2>

          <Callout>{t("home:sections.packages.description")}</Callout>
        </MediumBlock>

        <MediumBlock>
          <H3>{t("home:sections.packages.packages.title")}</H3>

          <Grid columns={3}>
            {
              (
                t(
                  "home:sections.packages.packages.packages",
                  { returnObjects: true },
                ) as {
                  description: string
                  link: string
                  linkLabel: string
                  price: string
                  tag: string
                  title: string
                }[]
              ).map(pkg => (
                <PackageCard
                  description={pkg.description}
                  key={pkg.title}
                  link={pkg.link}
                  linkLabel={pkg.linkLabel}
                  price={pkg.price}
                  tag={pkg.tag}
                  title={pkg.title}
                />
              ))
            }
          </Grid>
        </MediumBlock>

        <CtaCard
          description={t("home:sections.packages.cta.description")}
          links={
            [
              {
                description: t("home:sections.packages.cta.links.0.description"),
                external: true,
                href: t("paths:calendar"),
                label: t("home:sections.packages.cta.links.0.title"),
                variant: "primary",
              },
              {
                description: t("home:sections.packages.cta.links.1.description"),
                href: t("paths:offer"),
                label: t("home:sections.packages.cta.links.1.title"),
                variant: "secondary",
              },
            ]
          }
          title={t("home:sections.packages.cta.title")}
          variant="secondary"
        />

        <SectionHint>
          {t("home:sections.packages.hint.title")}
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
            {t("home:sections.packages.hint.link1Title")}
          </Link>
          {" "}
          {t("home:sections.packages.hint.or")}
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
            {t("home:sections.packages.hint.link2Title")}
          </Link>
        </SectionHint>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("home:sections.aboutMe.title")}</H2>

          <Callout>{t("home:sections.aboutMe.description")}</Callout>
        </MediumBlock>

        <MediumBlock>
          <H3>{t("home:sections.aboutMe.personas.title")}</H3>

          <Grid columns={1}>
            {
              (
                t(
                  "home:sections.aboutMe.personas.personas",
                  { returnObjects: true },
                ) as {
                  icon: string
                  link: string
                  linkLabel: string
                  subtitle: string
                  title: string
                }[]
              ).map(persona => (
                <TextBox
                  icon={persona.icon}
                  key={persona.title}
                  link={persona.link}
                  linkLabel={persona.linkLabel}
                  subtitle={persona.subtitle}
                  title={persona.title}
                />
              ))
            }
          </Grid>
        </MediumBlock>

        <MediumBlock>
          <H3>{t("home:sections.aboutMe.howIWork.title")}</H3>

          <Grid columns={2}>
            {
              (
                t(
                  "home:sections.aboutMe.howIWork.process",
                  { returnObjects: true },
                ) as {
                  description: string
                  icon: string
                  number: string
                  title: string
                }[]
              ).map(process => (
                <FeatureCard
                  description={process.description}
                  icon={process.icon}
                  key={process.title}
                  number={process.number}
                  title={process.title}
                />
              ))
            }
          </Grid>
        </MediumBlock>

        <SectionHint>
          {t("home:sections.aboutMe.hint.title")}
          {" "}
          <Link
            className={
              `
                inline-block
                md:text-base
              `
            }
            href={t("paths:aboutMe")}
            variant="cta-link"
          >
            {t("home:sections.aboutMe.hint.linkTitle")}
          </Link>
        </SectionHint>

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("home:sections.blog.title")}</H2>

          <Grid columns={1}>
            {
              articles.map(post => (
                <BlogCard
                  category={post.category}
                  date={post.date}
                  description={post.description}
                  key={post.title}
                  link={post.link}
                  linkLabel={post.linkLabel}
                  readingTime={post.readingTime}
                  title={post.title}
                />
              ))
            }
          </Grid>
        </MediumBlock>

        <CtaCard
          description={t("home:sections.blog.cta.description")}
          links={
            [
              {
                description: t("home:sections.blog.cta.links.0.description"),
                href: t("paths:blog"),
                label: t("home:sections.blog.cta.links.0.title"),
                variant: "secondary",
              },
            ]
          }
          title={t("home:sections.blog.cta.title")}
          variant="secondary"
        />

        <Separator />
      </Section>

      <Section>
        <MediumBlock>
          <H2>{t("home:sections.contact.title")}</H2>

          <Callout>{t("home:sections.contact.callout")}</Callout>
        </MediumBlock>

        <Grid columns={2}>
          <CtaCard
            description={t("home:sections.contact.cta.0.description")}
            icon={t("home:sections.contact.cta.0.icon")}
            links={
              [
                {
                  description: t("home:sections.contact.cta.0.info"),
                  external: true,
                  href: t("paths:calendar"),
                  label: t("home:sections.contact.cta.0.linkTitle"),
                  variant: "primary",
                },
              ]
            }
            title={t("home:sections.contact.cta.0.title")}
            variant="primary"
          />
          <CtaCard
            description={t("home:sections.contact.cta.1.description")}
            icon={t("home:sections.contact.cta.1.icon")}
            links={
              [
                {
                  description: t("home:sections.contact.cta.1.info"),
                  href: t("paths:contactForm"),
                  label: t("home:sections.contact.cta.1.linkTitle"),
                  variant: "secondary",
                },
              ]
            }
            title={t("home:sections.contact.cta.1.title")}
            variant="primary"
          />
        </Grid>
      </Section>

      <ContactButton />
    </Content>
  );
};

export { Page };
