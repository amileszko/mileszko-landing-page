import { cn } from "@utils/classNameUtils";
import { type VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";

import { Button } from "../Button/Button";

const alertVariants = cva(
  `
    flex w-full items-start gap-4 p-4
    text-sm
  `,
  {
    variants: {
      variant: {
        error: "bg-error-50 text-error-400",
        info: "bg-brand-50 text-brand-700",
        success: "bg-success-50 text-success-700",
        warning: "bg-warning-50 text-warning-700",
      },
    },
  },
);

interface AlertProps
  extends React.ComponentProps<"div">,
  VariantProps<typeof alertVariants> {
  closeable?: boolean
  onClose?: () => void
}

const Alert = ({
  children,
  className,
  closeable = true,
  onClose,
  variant,
  ...props
}: AlertProps) => {
  const { locale } = usePageContext();
  const { t } = useTranslation(
    undefined,
    { lng: locale },
  );

  return (
    <div
      className={
        cn(
          alertVariants({ variant }),
          className,
        )
      }
      role="alert"
      {...props}
    >
      {variant === "error" && <span>{t("common:alert.error")}</span>}
      {variant === "info" && <span>{t("common:alert.info")}</span>}
      {variant === "success" && <span>{t("common:alert.success")}</span>}
      {variant === "warning" && <span>{t("common:alert.warning")}</span>}
      <div className="w-full">{children}</div>
      {
        closeable && (
          <Button className="text-xs" onClick={onClose} variant="cta-link">
            {t("common:alert.closeButtonTitle")}
          </Button>
        )
      }
    </div>
  );
};

export { Alert };
