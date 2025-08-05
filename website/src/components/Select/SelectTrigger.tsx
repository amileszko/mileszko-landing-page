import { Icon as SelectIcon, Trigger } from "@radix-ui/react-select";
import { cn } from "@utils/classNameUtils";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";

const SelectTrigger = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Trigger>) => {
  const { locale } = usePageContext();
  const { t } = useTranslation(
    undefined,
    { lng: locale },
  );

  return (
    <Trigger
      className={
        cn(
          `
            flex items-center justify-between gap-4 rounded-md
            border border-neutral-400 p-4 text-left text-sm
            transition-all duration-200 ease-in-out outline-none
            hover:border-neutral-500
            focus:border-neutral-500
            disabled:cursor-not-allowed disabled:border-neutral-300 disabled:text-neutral-400
            aria-[invalid=true]:border-error-600
            data-[placeholder]:text-neutral-500
            data-[state=open]:border-neutral-500
            md:p-6
          `,
          className,
        )
      }
      {...props}
    >
      {children}
      <SelectIcon asChild>
        <span className="text-xs">{t("common:select.chevronDown")}</span>
      </SelectIcon>
    </Trigger>
  );
};

export { SelectTrigger };
