import { H4 } from "@components/Header";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";

import { SmallBlock } from "../Block";
import { SecondaryParagraph } from "../Paragraph";
import { type CookieDetails } from "./CookiesCategories";

interface CookiesProps {
  cookies: CookieDetails[]
}

const Cookies = ({ cookies }: CookiesProps) => {
  const { locale } = usePageContext();
  const { t } = useTranslation(
    undefined,
    { lng: locale },
  );

  return (
    <ul className="flex flex-col gap-2">
      {
        cookies.map(cookie => (
          <li
            className={
              `
                flex flex-col gap-2 border-l-2 border-l-neutral-300
                pl-4
                md:pl-6
              `
            }
            key={cookie.name}
          >
            <SmallBlock>
              <H4>{cookie.name}</H4>
              <SecondaryParagraph>{cookie.description}</SecondaryParagraph>
            </SmallBlock>
            <div className="grid grid-cols-2">
              <SecondaryParagraph>
                <span className="font-medium not-italic">
                  {t("cookies:duration")}
                  :
                </span>
                {" "}
                <span>{cookie.duration}</span>
              </SecondaryParagraph>
              <SecondaryParagraph>
                <span className="font-medium not-italic">
                  {t("cookies:type")}
                  :
                </span>
                {" "}
                <span>{cookie.type}</span>
              </SecondaryParagraph>
            </div>
          </li>
        ))
      }
    </ul>
  );
};

export { Cookies };
