import { cn } from "@utils/classNameUtils";
import { type VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

import { ArticleHeader } from "./ArticleHeader";
import { Badge } from "./Badge/Badge";
import { MediumBlock, SmallBlock } from "./Block";
import { CtaGroup, type CtaLink } from "./CtaGroup";
import { H4 } from "./Header";
import { Link } from "./Link";
import { UnorderedList } from "./List";
import { PrimaryParagraph, SecondaryParagraph } from "./Paragraph";
import { Slot } from "./Slot";
import { Strong } from "./Strong";

interface CardProps extends React.ComponentProps<"div"> {
  asChild?: boolean
}

const Card = ({
  asChild,
  children,
  className,
  ...props
}: CardProps) => {
  const Component = asChild ? Slot : "div";

  return (
    <Component
      className={
        cn(
          `
            w-full rounded-md border border-neutral-200 p-4
            transition-all duration-200 ease-in-out
            hover:border-neutral-300
            md:p-6
          `,
          className,
        )
      }
      {...props}
    >
      {children}
    </Component>
  );
};

interface NumbersCardProps extends React.ComponentProps<typeof Card> {
  number: string
  subtitle: string
  title: string
}

const NumbersCard = ({
  className,
  number,
  subtitle,
  title,
  ...props
}: NumbersCardProps) => {
  return (
    <Card
      className={
        cn(
          `
            border-success-200 bg-success-50
            hover:border-success-300
          `,
          className,
        )
      }
      {...props}
    >
      <MediumBlock>
        <H4 className="text-success-700">{number}</H4>
        <SmallBlock>
          <H4 className="text-success-800">{title}</H4>
          <SecondaryParagraph>{subtitle}</SecondaryParagraph>
        </SmallBlock>
      </MediumBlock>
    </Card>
  );
};

interface ProjectCardProps extends React.ComponentProps<typeof Card> {
  category: string
  link: string
  linkLabel: string
  subtitle: string
  title: string
}

const ProjectCard = ({
  category,
  className,
  link,
  linkLabel,
  subtitle,
  title,
  ...props
}: ProjectCardProps) => {
  return (
    <Card
      className={
        cn(
          `
            group relative flex flex-col items-end
            justify-between gap-6 border-brand-200 bg-brand-50
            hover:border-brand-300
          `,
          className,
        )
      }
      {...props}
    >

      <SmallBlock className="text-brand-800">
        <H4>
          <Strong>{title}</Strong>
          {" – "}
          {category}
        </H4>
        <SecondaryParagraph>{subtitle}</SecondaryParagraph>

      </SmallBlock>
      <Link href={link} variant="cta-link">
        {linkLabel}
      </Link>
    </Card>
  );
};

interface PackageCardProps extends React.ComponentProps<typeof Card> {
  description: string
  link: string
  linkLabel: string
  price: string
  tag: string
  title: string
}

const PackageCard = ({
  className,
  description,
  link,
  linkLabel,
  price,
  tag,
  title,
  ...props
}: PackageCardProps) => {
  return (
    <Card
      className={
        cn(
          `
            group relative flex flex-col items-end
            justify-between gap-6 border-brand-200 bg-brand-50
            hover:border-brand-300
          `,
          className,
        )
      }
      {...props}
    >
      <Badge className="absolute top-4 right-4 text-xs">
        {tag}
      </Badge>

      <MediumBlock className="mt-12">
        <H4 className="flex flex-col">
          <span className="font-semibold text-brand-800">{title}</span>
          <span className="text-brand-700 italic">{price}</span>
        </H4>
        <SecondaryParagraph>{description}</SecondaryParagraph>
      </MediumBlock>

      <Link href={link} variant="cta-link">
        {linkLabel}
      </Link>
    </Card>
  );
};

interface ExtendedPackageCardProps extends React.ComponentProps<typeof Card> {
  description: string
  duration: string
  forWhom: string
  icon: string
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
}

const ExtendedPackageCard = ({
  className,
  description,
  duration,
  forWhom,
  icon,
  includes,
  label,
  outcomes,
  price,
  title,
  ...props
}: ExtendedPackageCardProps) => {
  return (
    <Card
      className={
        cn(
          `
            group relative flex flex-col items-end
            justify-between gap-6 border-brand-200 bg-brand-50
            hover:border-brand-300
          `,
          className,
        )
      }
      {...props}
    >
      <MediumBlock>
        <SmallBlock className="flex-row items-center gap-4">
          <div>{icon}</div>
          <H4 className="flex flex-col">
            <span className="font-semibold text-brand-800">{title}</span>
            <span className="text-brand-700 italic">{price}</span>
            <span className="text-sm text-neutral-600">{duration}</span>
          </H4>
        </SmallBlock>

        <div className="flex flex-wrap gap-2">
          <Badge className="text-xs">{label}</Badge>
          <Badge className="text-xs">{forWhom}</Badge>
        </div>

        <SecondaryParagraph className="text-sm">
          {description}
        </SecondaryParagraph>
      </MediumBlock>

      <MediumBlock>
        <SmallBlock>
          <PrimaryParagraph className="text-sm font-semibold">
            {includes.title}
          </PrimaryParagraph>
          <UnorderedList
            items={includes.items}
            list="checkmark"
            variant="secondary"
          />
        </SmallBlock>

        <SmallBlock>
          <PrimaryParagraph className="text-sm font-semibold">
            {outcomes.title}
          </PrimaryParagraph>
          <UnorderedList
            items={outcomes.items}
            list="arrow"
            variant="secondary"
          />
        </SmallBlock>
      </MediumBlock>
    </Card>
  );
};

interface FeatureCardProps extends React.ComponentProps<typeof Card> {
  description: string
  icon: string
  number: string
  title: string
}

const FeatureCard = ({
  className,
  description,
  icon,
  number,
  title,
  ...props
}: FeatureCardProps) => {
  return (
    <Card
      className={
        cn(
          `
            relative border-success-200 bg-success-50
            hover:border-success-300
          `,
          className,
        )
      }
      {...props}
    >
      <Badge
        className={
          `
            absolute top-4 right-4 flex h-6
            w-6 items-center justify-center bg-success-200 p-0
            text-xs font-bold text-success-700
          `
        }
      >
        {number}
      </Badge>

      <SmallBlock>
        <div className="flex items-center gap-4 pr-6">
          <div>{icon}</div>
          <H4
            className="leading-tight break-words hyphens-auto text-success-800"
          >
            {title}
          </H4>
        </div>
        <SecondaryParagraph>{description}</SecondaryParagraph>
      </SmallBlock>
    </Card>
  );
};

interface BlogCardProps extends React.ComponentProps<typeof Card> {
  category: string
  date: string
  description: string
  link: string
  linkLabel: string
  readingTime: string
  title: string
}

const BlogCard = ({
  category,
  className,
  date,
  description,
  link,
  linkLabel,
  readingTime,
  title,
  ...props
}: BlogCardProps) => {
  return (
    <Card
      className={
        cn(className)
      }
      {...props}
      asChild
    >
      <article>
        <MediumBlock>
          <ArticleHeader
            category={category}
            date={date}
            readingTime={readingTime}
          />
          <SmallBlock>
            <H4>
              {title}
            </H4>
            <SecondaryParagraph>{description}</SecondaryParagraph>
          </SmallBlock>
          <Link href={link} variant="cta-link">
            {linkLabel}
          </Link>
        </MediumBlock>
      </article>
    </Card>
  );
};

interface StatusCardProps extends React.ComponentProps<typeof Card> {
  description: string
  icon: string
  title: string
}

const StatusCard = ({
  className,
  description,
  icon,
  title,
  ...props
}: StatusCardProps) => {
  return (
    <Card
      className={
        cn(
          `
            relative flex items-start gap-4 border-success-200
            bg-success-50
            hover:border-success-300
          `,
          className,
        )
      }
      {...props}
    >
      <div
        className={
          `
            flex h-12 w-12 shrink-0 items-center
            justify-center rounded-md bg-success-200
          `
        }
      >
        <span>{icon}</span>
      </div>
      <SmallBlock>
        <H4 className="text-success-800">{title}</H4>
        {description && <SecondaryParagraph>{description}</SecondaryParagraph>}
      </SmallBlock>
    </Card>
  );
};

const ctaCardVariants = cva(
  "flex items-start gap-4",
  {
    variants: {
      variant: {
        primary: `
          border-success-200 bg-success-50
          hover:border-success-300
        `,
        secondary: `
          border-neutral-200 bg-neutral-50
          hover:border-neutral-300
        `,
      },
    },
  },
);

const ctaCardTitleVariants = cva(
  undefined,
  {
    variants: {
      variant: {
        primary: "text-success-800",
        secondary: "text-neutral-800",
      },
    },
  },
);

const ctaCardIconVariants = cva(
  `
    flex h-12 w-12 shrink-0 items-center
    justify-center rounded-md
  `,
  {
    variants: {
      variant: {
        primary: "bg-success-200",
        secondary: "bg-neutral-100",
      },
    },
  },
);

interface CtaCardProps
  extends React.ComponentProps<typeof Card>,
  VariantProps<typeof ctaCardVariants> {
  description: string
  icon?: string
  links: CtaLink[]
  title: string
}

const CtaCard = ({
  className,
  description,
  icon,
  links,
  title,
  variant,
  ...props
}: CtaCardProps) => {
  return (
    <Card
      className={
        cn(
          ctaCardVariants({ variant }),
          className,
        )
      }
      {...props}
    >
      {
        icon && (
          <div className={
            cn(ctaCardIconVariants({ variant }))
          }
          >
            <span>{icon}</span>
          </div>
        )
      }
      <MediumBlock className="h-full justify-between">
        <SmallBlock>
          <H4 className={
            cn(ctaCardTitleVariants({ variant }))
          }
          >
            {title}
          </H4>
          <SecondaryParagraph>{description}</SecondaryParagraph>
        </SmallBlock>
        <SmallBlock>
          <CtaGroup links={links} />
        </SmallBlock>
      </MediumBlock>
    </Card>
  );
};

export {
  BlogCard,
  Card,
  CtaCard,
  ExtendedPackageCard,
  FeatureCard,
  NumbersCard,
  PackageCard,
  ProjectCard,
  StatusCard,
};
