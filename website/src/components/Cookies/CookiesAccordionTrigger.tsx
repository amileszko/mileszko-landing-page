import { cn } from "@utils/classNameUtils";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";

import { AccordionTrigger } from "../Accordion/AccordionTrigger";
import { Button } from "../Button/Button";

const CookiesAccordionTrigger = ({
  children,
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof AccordionTrigger> & {
  disabled?: boolean
}) => {
  const { locale } = usePageContext();
  const { t } = useTranslation(
    undefined,
    { lng: locale },
  );

  return (
    <AccordionTrigger
      className={
        cn(
          "group",
          className,
        )
      }
      {...props}
      asChild
    >
      <Button disabled={disabled} variant="cta-link">
        {children}
        <span
          className={
            `
              text-xs
              group-data-[active]:hidden
              group-data-[state=open]:hidden
            `
          }
        >
          {t("cookies:accordion.show")}
        </span>
        <span
          className={
            `
              hidden text-xs
              group-data-[active]:block
              group-data-[state=open]:block
            `
          }
        >
          {t("cookies:accordion.hide")}
        </span>
      </Button>
    </AccordionTrigger>
  );
};

export { CookiesAccordionTrigger };
