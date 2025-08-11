import { cn } from "@utils/classNameUtils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { BlockQuote } from "./BlockQuote";
import { H1, H2, H3, H4 } from "./Header";
import { Link } from "./Link";
import { PrimaryParagraph } from "./Paragraph";
import { Separator } from "./Separator";
import { Strong } from "./Strong";

interface MarkdownArticleProps extends React.ComponentProps<"article"> {
  markdown: string
}

const MarkdownArticle = ({
  className,
  markdown,
  ...props
}: MarkdownArticleProps) => {
  return (
    <article
      className={
        cn(
          "w-full",
          className,
        )
      }
      {...props}
    >
      <ReactMarkdown
        components={
          {
            a: ({ children, href }) => (
              <Link href={href ?? ""} variant="cta-link">
                {children}
              </Link>
            ),
            blockquote: ({ children }) => (
              <BlockQuote className="my-4">
                {children}
              </BlockQuote>
            ),
            h1: ({ children }) => (
              <H1
                className={
                  `
                    mt-8 mb-6
                    first:mt-0
                  `
                }
              >
                {children}
              </H1>
            ),
            h2: ({ children }) => (
              <H2
                className={
                  `
                    mt-6 mb-6
                    first:mt-0
                  `
                }
              >
                {children}
              </H2>
            ),
            h3: ({ children }) => (
              <H3
                className={
                  `
                    mt-4 mb-4
                    first:mt-0
                  `
                }
              >
                {children}
              </H3>
            ),
            h4: ({ children }) => (
              <H4
                className={
                  `
                    mt-2 mb-2
                    first:mt-0
                  `
                }
              >
                {children}
              </H4>
            ),
            hr: () => <Separator className="my-6" />,
            ol: ({ children }) => (
              <ol className="flex list-inside list-decimal flex-col gap-2">
                {children}
              </ol>
            ),
            p: ({ children }) => (
              <PrimaryParagraph>{ children }</PrimaryParagraph>
            ),
            strong: ({ children }) => <Strong>{children}</Strong>,
            table: ({ children }) => (
              <div className="w-full overflow-x-auto">
                <table className="w-full">
                  {children}
                </table>
              </div>
            ),
            td: ({ children }) => (
              <td className="p-4 align-top text-sm">
                {children}
              </td>
            ),
            th: ({ children }) => (
              <th className="p-4 text-left font-heading font-medium">
                {children}
              </th>
            ),
            tr: ({ children }) => (
              <tr className={
                `
                  border-b border-neutral-100
                  last:border-b-0
                `
              }
              >
                {children}
              </tr>
            ),
            ul: ({ children }) => (
              <ul className={
                `
                  my-4 ml-4 flex list-none flex-col
                  gap-2
                  md:ml-6
                `
              }
              >
                {children}
              </ul>
            ),
          }
        }
        remarkPlugins={
          [remarkGfm]
        }
      >
        {markdown}
      </ReactMarkdown>
    </article>
  );
};

export { MarkdownArticle };
