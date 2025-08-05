import { cn } from "@utils/classNameUtils";

import { TabsContent } from "../../Tabs/TabsContent";

const CookiesDialogTabsContent = ({
  className,
  ...props
}: React.ComponentProps<typeof TabsContent>) => (
  <TabsContent
    className={
      cn(
        "min-h-0 overflow-y-auto",
        className,
      )
    }
    {...props}
  />
);

export { CookiesDialogTabsContent };
