import { format, type Locale } from "date-fns";
import { enUS, pl } from "date-fns/locale";
import { usePageContext } from "vike-react/usePageContext";

import { Badge } from "./Badge/Badge";
import { SmallBlock } from "./Block";

const locales: Record<string, Locale> = { pl: pl };

interface ArticleHeaderProps extends React.ComponentProps<typeof SmallBlock> {
  category: string
  date: string
  readingTime: string
}

const ArticleHeader = ({
  category,
  date,
  readingTime,
}: ArticleHeaderProps) => {
  const { locale } = usePageContext();

  return (
    <SmallBlock className="flex-row items-center text-center text-xs">
      <Badge className="text-xs">{category}</Badge>
      <span className="text-neutral-500">{readingTime}</span>
      <span className="text-neutral-300">•</span>
      <span className="text-neutral-500">
        {
          format(
            date,
            "d MMMM yyyy",
            { locale: locales[locale] ?? enUS },
          )
        }
      </span>
    </SmallBlock>
  );
};

export { ArticleHeader };
