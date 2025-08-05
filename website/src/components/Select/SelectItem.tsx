import { Item, ItemIndicator, ItemText } from "@radix-ui/react-select";
import { cn } from "@utils/classNameUtils";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";

const SelectItem = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Item>) => {
  const { locale } = usePageContext();
  const { t } = useTranslation(
    undefined,
    { lng: locale },
  );

  return (
    <Item
      className={
        cn(
          `
            group flex cursor-pointer items-center justify-between
            gap-4 px-4 py-3 text-neutral-500 transition-all
            duration-200 ease-in-out outline-none
            group-data-[state=checked]:text-neutral-800
            first:pt-5
            last:pb-5
            hover:text-neutral-800
            focus:text-neutral-800
            data-[disabled]:cursor-not-allowed data-[disabled]:text-neutral-400
            md:px-6 md:py-4
            first:md:pt-6
            last:md:pb-6
          `,
          className,
        )
      }
      {...props}
    >
      <ItemText>{children}</ItemText>
      <ItemIndicator>
        <span>{t("common:select.check")}</span>
      </ItemIndicator>
    </Item>
  );
};

export { SelectItem };
