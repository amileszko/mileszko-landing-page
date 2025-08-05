import { Description } from "@radix-ui/react-dialog";
import { cn } from "@utils/classNameUtils";

import { PrimaryParagraph } from "../Paragraph";

const DialogDescription = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Description>) => (
  <Description className={cn(className)} {...props} asChild>
    <PrimaryParagraph>{children}</PrimaryParagraph>
  </Description>
);

export { DialogDescription };
