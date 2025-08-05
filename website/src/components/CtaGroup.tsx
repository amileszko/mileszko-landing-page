import { cn } from "@utils/classNameUtils";

import { SmallBlock } from "./Block";
import { Button, CtaButtonLabelWithDescription } from "./Button/Button";

interface CtaGroupProps extends React.ComponentProps<"div"> {
  links: CtaLink[]
}

interface CtaLink {
  description?: string
  download?: boolean
  external?: boolean
  href: string
  label: string
  variant?: "primary" | "secondary"
}

const CtaGroup = ({
  className,
  links,
  ...props
}: CtaGroupProps) => {
  return (
    <SmallBlock
      className={
        cn(
          "md:flex-row",
          className,
        )
      }
      {...props}
    >
      {
        links.map(({
          description,
          download,
          external,
          href,
          label,
          variant = "primary",
        }) => {
          const buttonVariant = variant === "primary" ?
            "cta-primary-with-description" :
            "cta-secondary-with-description";

          return (

            <Button
              asChild
              className="w-full"
              key={href}
              variant={buttonVariant}
            >
              <a
                download={download}
                href={href}
                rel={external ? "noopener noreferrer" : undefined}
                target={external ? "_blank" : undefined}
              >
                <CtaButtonLabelWithDescription
                  description={description}
                  label={label}
                />
              </a>
            </Button>
          );
        })
      }
    </SmallBlock>
  );
};

export { CtaGroup };
export type { CtaLink };
