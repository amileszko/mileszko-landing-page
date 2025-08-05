import { cn } from "@utils/classNameUtils";

import { Badge } from "./Badge/Badge";

interface SkillBadgeProps extends React.ComponentProps<typeof Badge> {
  icon: string
  title: string
}

const SkillBadge = ({
  className,
  icon,
  title,
  ...props
}: SkillBadgeProps) => {
  const content = (
    <Badge className={cn(className)} {...props}>
      <span>{icon}</span>
      <span className="font-semibold">{title}</span>
    </Badge>
  );

  return content;
};

export { SkillBadge };
