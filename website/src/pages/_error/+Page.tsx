import {
  Badge,
  Content,
  LargeBlock,
  Link,
  MediumBlock,
  Section,
} from "@components";
import { H1, H2 } from "@components/Header";
import { PrimaryParagraph } from "@components/Paragraph";
import { type JSX } from "react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";

const Page = (): JSX.Element => {
  const { locale } = usePageContext();
  const { t } = useTranslation(
    undefined,
    { lng: locale },
  );
  const { is404 } = usePageContext();

  return (
    <div className="flex min-h-screen flex-col justify-center bg-neutral-50">
      <main>
        <Content>
          <Section>
            <LargeBlock>
              <Badge>
                {
                  is404 ?
                    t("error:404:icon") + " 404" :
                    t("error:500:icon") + " 500"
                }
              </Badge>

              <MediumBlock>
                <H1>{is404 ? t("error:404:title") : t("error:500:title")}</H1>

                <H2 className="text-neutral-600">
                  {is404 ? t("error:404:info") : t("error:500:info")}
                </H2>

                <PrimaryParagraph>{t("error:callout")}</PrimaryParagraph>

                <Link href={t("paths:home")} variant="cta-primary">
                  {t("error:back")}
                </Link>
              </MediumBlock>
            </LargeBlock>
          </Section>
        </Content>
      </main>
    </div>
  );
};

export { Page };
