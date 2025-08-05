import { cn } from "@utils/classNameUtils";

import { SmallBlock } from "./Block";
import { Card } from "./Card";
import { H4 } from "./Header";
import { PrimaryParagraph } from "./Paragraph";

interface TableProps extends React.ComponentProps<"div"> {
  headers: string[]
  highlightLastColumn?: boolean
  rows: string[][]
}

const Table = ({
  className,
  headers,
  highlightLastColumn = false,
  rows,
  ...props
}: TableProps) => {
  const lastColumnIndex = headers.length - 1;

  return (
    <div
      className={
        cn(
          "w-full overflow-hidden",
          className,
        )
      }
      {...props}
    >
      <div
        className={
          `
            hidden
            lg:block
          `
        }
      >
        <Card className="overflow-hidden p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                {
                  headers.map((header, index) => (
                    <th
                      className={
                        cn(
                          "p-4 text-left font-heading font-medium",
                          highlightLastColumn && index === lastColumnIndex ?
                            "text-success-800" :
                            "text-neutral-800",
                          index === 0 ? "w-1/4" : "w-1/4",
                        )
                      }
                      key={header}
                    >
                      {header}
                    </th>
                  ))
                }
              </tr>
            </thead>
            <tbody>
              {
                rows.map(row => (
                  <tr
                    className={
                      `
                        border-b border-neutral-100 transition-colors duration-200
                        last:border-b-0
                      `
                    }
                    key={row.join("-")}
                  >
                    {
                      row.map((cell, cellIndex) => (
                        <td
                          className={
                            cn(
                              "p-4 align-top text-sm",
                              cellIndex === 0 ?
                                "font-medium text-neutral-800" :
                                (highlightLastColumn && cellIndex ===
                                lastColumnIndex ?
                                  "font-medium text-success-700" :
                                  "text-neutral-700"),
                            )
                          }
                          key={cell}
                        >
                          {cell}
                        </td>
                      ))
                    }
                  </tr>
                ))
              }
            </tbody>
          </table>
        </Card>
      </div>

      <div
        className={
          `
            flex flex-col gap-4
            lg:hidden
          `
        }
      >
        {
          rows.map(row => (
            <Card key={row.join("-")}>
              <SmallBlock>
                <H4 className="font-medium text-neutral-800">{row[0]}</H4>
                <SmallBlock>
                  {
                    headers.slice(1)
                      .map((header, headerIndex) => {
                        const actualColumnIndex = headerIndex + 1;
                        const isHighlighted =
                      highlightLastColumn &&
                      actualColumnIndex === lastColumnIndex;

                        return (
                          <div key={header}>
                            <div
                              className={
                                cn(
                                  "text-xs font-medium",
                                  isHighlighted ?
                                    "text-success-700" :
                                    "text-neutral-600",
                                )
                              }
                            >
                              {header}
                            </div>
                            <PrimaryParagraph
                              className={
                                cn(
                                  "text-sm",
                                  isHighlighted ?
                                    "font-medium text-success-700" :
                                    "text-neutral-700",
                                )
                              }
                            >
                              {row[actualColumnIndex]}
                            </PrimaryParagraph>
                          </div>
                        );
                      })
                  }
                </SmallBlock>
              </SmallBlock>
            </Card>
          ))
        }
      </div>
    </div>
  );
};

export { Table };
