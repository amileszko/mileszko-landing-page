import { cn } from "@utils/classNameUtils";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";

import { useFormField } from "./hooks/useFormField";

const FormMessage = ({
  children,
  className,
  ...props
}: React.ComponentProps<"p">) => {
  const { locale } = usePageContext();
  const { t } = useTranslation(
    undefined,
    { lng: locale },
  );
  const {
    error,
    formMessageId,
    isDirty,
    successState,
  } = useFormField();
  const body = error ? error.message : children;

  if (!body) {
    return;
  }

  return (
    <div className="flex flex-row items-center gap-1">
      {
        error && (
          <span className="text-[1rem]">{t("common:form.message.error")}</span>
        )
      }
      {
        !error && successState && isDirty && (
          <span className="text-[1rem]">{t("common:form.message.success")}</span>
        )
      }
      {
        !error && (!successState || !isDirty) && (
          <span className="text-[1rem]">{t("common:form.message.info")}</span>
        )
      }
      <p
        className={
          cn(
            "text-[0.75rem]/[0.75rem] text-neutral-600",
            className,
          )
        }
        id={formMessageId}
        {...props}
      >
        {body}
      </p>
    </div>
  );
};

export { FormMessage };
