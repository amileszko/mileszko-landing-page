import { Root } from "@radix-ui/react-switch";
import { cn } from "@utils/classNameUtils";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";

const Switch = ({
  className,
  ...props
}: React.ComponentProps<typeof Root>) => {
  const { locale } = usePageContext();
  const { t } = useTranslation(
    undefined,
    { lng: locale },
  );

  return (
    <Root
      className={
        cn(
          `
            group peer inline-flex h-6 w-fit
            shrink-0 cursor-pointer items-center justify-center rounded-md
            border-1 px-2 text-xs font-medium transition-all
            duration-200 ease-in-out
            focus-visible:outline-none
            disabled:cursor-not-allowed disabled:opacity-50
            data-[state=checked]:border-error-200 data-[state=checked]:bg-error-50 data-[state=checked]:text-error-600 data-[state=checked]:hover:bg-error-100 data-[state=checked]:disabled:hover:bg-error-50
            data-[state=unchecked]:border-success-500 data-[state=unchecked]:bg-success-500 data-[state=unchecked]:text-neutral-50 data-[state=unchecked]:hover:bg-success-600 data-[state=unchecked]:disabled:hover:bg-success-500
          `,
          className,
        )
      }
      {...props}
    >
      <span className="group-data-[state=checked]:hidden">
        {t("common:switch.acceptButtonTitle")}
      </span>
      <span
        className={
          `
            hidden
            group-data-[state=checked]:block
          `
        }
      >
        {t("common:switch.rejectButtonTitle")}
      </span>
    </Root>
  );
};

export { Switch };
