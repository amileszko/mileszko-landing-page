import { ScrollDownButton } from "@radix-ui/react-select";
import { cn } from "@utils/classNameUtils";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";

const SelectScrollDownButton = ({
  className,
  ...props
}: React.ComponentProps<typeof ScrollDownButton>) => {
  const { locale } = usePageContext();
  const { t } = useTranslation(
    undefined,
    { lng: locale },
  );

  return (
    <ScrollDownButton
      className={
        cn(
          "flex cursor-default items-center justify-center py-1",
          className,
        )
      }
      {...props}
    >
      <span className="text-xs">{t("common:select.chevronDown")}</span>
    </ScrollDownButton>
  );
};

export { SelectScrollDownButton };
