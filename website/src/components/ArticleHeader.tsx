import { Badge } from "./Badge/Badge";
import { SmallBlock } from "./Block";

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
  return (
    <SmallBlock className="flex-row items-center text-xs">
      <Badge className="text-xs">{category}</Badge>
      <span className="text-neutral-500">{readingTime}</span>
      <span className="text-neutral-300">•</span>
      <span className="text-neutral-500">{date}</span>
    </SmallBlock>
  );
};

export { ArticleHeader };
