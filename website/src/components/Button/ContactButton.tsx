import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";

import { Link } from "../Link";

const ContactButton = () => {
  const { locale } = usePageContext();
  const { t } = useTranslation(
    undefined,
    { lng: locale },
  );

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <div
        className={
          `
            absolute top-2 left-2 h-10 w-10
            animate-ping rounded-full bg-brand-400 opacity-75
          `
        }
      />
      <Link
        className="h-14 w-14 rounded-full"
        href={t("paths:contact")}
        variant="cta-primary"
      >
        💬
      </Link>
    </div>
  );
};

export { ContactButton };
