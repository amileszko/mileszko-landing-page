import { cn } from "@utils/classNameUtils";
import { cva } from "class-variance-authority";
import { type JSX } from "react";

import { MediumBlock, SmallBlock } from "../Block";
import { Grid } from "../Grid";
import { H3 } from "../Header";
import { Link } from "../Link";

const footerLinksGroupGridVariants = cva(
  undefined,
  {
    variants: {
      gridColumns: {
        1: "grid-cols-1",
        2: "grid-cols-2",
        3: "grid-cols-3",
      },
    },
  },
);

interface FooterLinksGroupProps
  extends React.ComponentProps<typeof MediumBlock> {
  columns: {
    links: {
      download?: boolean
      external?: boolean
      name: string
      path: string
    }[]
  }[]
  title: string
}

const FooterLinksGroup = ({
  className,
  columns,
  title,
  ...props
}: FooterLinksGroupProps): JSX.Element => {
  const gridColumns =
    columns.length === 1 ? 1 : (columns.length === 2 ? 2 : 3);

  return (
    <MediumBlock
      className={
        cn(
          "w-auto",
          className,
        )
      }
      {...props}
    >
      <H3 className="text-sm font-medium text-neutral-400">{title}</H3>
      <Grid className={
        cn(footerLinksGroupGridVariants({ gridColumns }))
      }
      >
        {
          columns.map(column => (
            <SmallBlock
              className="gap-0"
              key={
                column.links.map(link => link.name)
                  .join("-")
              }
            >
              {
                column.links.map(link => (
                  <Link
                    download={link.download}
                    href={link.path}
                    key={link.name}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    target={link.external ? "_blank" : undefined}
                    variant="footer-link"
                  >
                    {link.name}
                  </Link>
                ))
              }
            </SmallBlock>
          ))
        }
      </Grid>
    </MediumBlock>
  );
};

export { FooterLinksGroup, type FooterLinksGroupProps };
