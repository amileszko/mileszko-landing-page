import { cn } from "@utils/classNameUtils";

import { MediumBlock, SmallBlock } from "./Block";
import { Button } from "./Button/Button";
import { Card } from "./Card";
import { H4 } from "./Header";
import { PrimaryParagraph, SecondaryParagraph } from "./Paragraph";

interface TextBoxProps extends React.ComponentProps<"div"> {
  download?: boolean
  external?: boolean
  icon: string
  link?: string
  linkLabel?: string
  subtitle: string
  title: string
}

const TextBox = ({
  className,
  download,
  external,
  icon,
  link,
  linkLabel,
  subtitle,
  title,
  ...props
}: TextBoxProps) => {
  return (
    <Card
      className={
        cn(
          "flex items-start gap-4",
          className,
        )
      }
      {...props}
    >
      <div
        className={
          `
            flex h-12 w-12 shrink-0 items-center
            justify-center rounded-md bg-brand-200
          `
        }
      >
        {icon}
      </div>
      <MediumBlock>
        <SmallBlock>
          <H4 className="text-brand-800">{title}</H4>
          <SecondaryParagraph>{subtitle}</SecondaryParagraph>

        </SmallBlock>
        {
          link && (
            <Button asChild variant="cta-link">
              <a
                download={download}
                href={link}
                rel={external ? "noopener noreferrer" : undefined}
                target={external ? "_blank" : undefined}
              >
                {linkLabel}
              </a>
            </Button>
          )
        }
      </MediumBlock>
    </Card>
  );
};

interface PersonasTextBoxProps extends React.ComponentProps<"div"> {
  helpAndEffect: string
  helpAndEffectTitle: string
  icon: string
  link: string
  linkLabel: string
  problems: string
  problemsTitle: string
  title: string
}

const PersonasTextBox = ({
  className,
  helpAndEffect,
  helpAndEffectTitle,
  icon,
  link,
  linkLabel,
  problems,
  problemsTitle,
  title,
  ...props
}: PersonasTextBoxProps) => {
  return (
    <Card
      className={
        cn(
          "flex items-start gap-4 py-2",
          className,
        )
      }
      {...props}
    >
      <div
        className={
          `
            flex h-12 w-12 shrink-0 items-center
            justify-center rounded-md bg-brand-100
          `
        }
      >
        {icon}
      </div>
      <MediumBlock>
        <SmallBlock>
          <H4 className="text-brand-800">{title}</H4>
          <PrimaryParagraph className="font-medium">
            {problemsTitle}
          </PrimaryParagraph>
          <SecondaryParagraph>{problems}</SecondaryParagraph>
          <PrimaryParagraph className="font-medium">
            {helpAndEffectTitle}
          </PrimaryParagraph>
          <SecondaryParagraph>{helpAndEffect}</SecondaryParagraph>

        </SmallBlock>
        <Button asChild variant="cta-link">
          <a href={link}>{linkLabel}</a>
        </Button>
      </MediumBlock>
    </Card>
  );
};

export { PersonasTextBox, TextBox };
