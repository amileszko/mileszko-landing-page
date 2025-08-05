import { cn } from "@utils/classNameUtils";

import { MediumBlock, SmallBlock } from "./Block";
import { Card } from "./Card";
import { H4 } from "./Header";
import { SecondaryParagraph } from "./Paragraph";

const Timeline = ({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <MediumBlock
      className={
        cn(
          "relative",
          className,
        )
      }
      {...props}
    >
      <div className={
        `
          absolute top-0 bottom-0 left-6 w-px
          bg-neutral-200
        `
      }
      />

      {children}
    </MediumBlock>
  );
};

interface TimelineItemProps extends React.ComponentProps<"div"> {
  date?: string
  icon: string
  subtitle: string
  title: string
}

const TimelineItem = ({
  className,
  date,
  icon,
  subtitle,
  title,
  ...props
}: TimelineItemProps) => {
  return (
    <div
      className={
        cn(
          "relative flex w-full gap-6",
          className,
        )
      }
      {...props}
    >
      <div className="flex flex-col items-center gap-2">
        <div
          className={
            `
              relative flex h-12 w-12 shrink-0
              items-center justify-center rounded-md bg-brand-200 text-brand-700
            `
          }
        >
          {icon}
        </div>
        {
          date && (
            <div
              className={
                `
                  min-w-22 rounded-md bg-brand-200 px-2 py-1
                  text-center text-xs font-medium text-brand-700
                `
              }
            >
              {date}
            </div>
          )
        }
      </div>
      <Card
        className={
          `
            border-brand-200 bg-brand-50
            hover:border-brand-300
          `
        }
      >
        <SmallBlock>
          <H4 className="text-brand-800">{title}</H4>
          <SecondaryParagraph>{subtitle}</SecondaryParagraph>
        </SmallBlock>
      </Card>
    </div>
  );
};

export { Timeline, TimelineItem };
