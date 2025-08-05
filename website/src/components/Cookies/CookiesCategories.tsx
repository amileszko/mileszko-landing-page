import { Accordion } from "../Accordion/Accordion";
import { AccordionContent } from "../Accordion/AccordionContent";
import { AccordionItem } from "../Accordion/AccordionItem";
import { Badge } from "../Badge/Badge";
import { SmallBlock } from "../Block";
import { H4 } from "../Header";
import { PrimaryParagraph } from "../Paragraph";
import { Switch } from "../Switch";
import { CookiesAccordionTrigger } from "./CookiesAccordionTrigger";
import { CookiesProviders } from "./CookiesProviders";

interface CookieDetails {
  description: string
  duration: string
  name: string
  type: string
}

interface CookiesCategoriesProps {
  cookiesCategories: CookiesCategory[]
  cookiesCategoriesNamesToAccept: string[]
  onCategoryAcceptChange: (categoryName: string, accepted: boolean) => void
}

interface CookiesCategory {
  description: string
  name: string
  providers: CookiesCategoryProvider[]
  required: boolean
}

interface CookiesCategoryProvider {
  cookies: CookieDetails[]
  provider: CookiesProvider
}

interface CookiesProvider {
  name: string
  url: string
}

const CookiesCategories = ({
  cookiesCategories,
  cookiesCategoriesNamesToAccept,
  onCategoryAcceptChange,
}: CookiesCategoriesProps) => {
  return (
    <Accordion>
      {
        cookiesCategories.map(category => (
          <AccordionItem key={category.name} value={category.name}>
            <SmallBlock>
              <div
                className={
                  `
                    relative flex w-full items-center justify-between
                    overflow-hidden
                  `
                }
              >
                <SmallBlock className="flex-row items-center">
                  <H4>{category.name}</H4>
                  <Badge className="flex size-6 items-center justify-center p-0">
                    {
                      category.providers.reduce(
                        (total, provider) => total + provider.cookies.length,
                        0,
                      )
                    }
                  </Badge>
                  <CookiesAccordionTrigger
                    disabled={category.providers.length === 0}
                  />
                </SmallBlock>
                <Switch
                  defaultChecked={
                    cookiesCategoriesNamesToAccept.includes(category.name)
                  }
                  disabled={
                    category.required ||
                    category.providers.length === 0
                  }
                  onCheckedChange={
                    (checked) => {
                      onCategoryAcceptChange(
                        category.name,
                        checked,
                      );
                    }
                  }
                />
              </div>
              <PrimaryParagraph>{category.description}</PrimaryParagraph>
            </SmallBlock>
            <AccordionContent className="mt-6">
              <CookiesProviders cookiesCategoryProviders={category.providers} />
            </AccordionContent>
          </AccordionItem>
        ))
      }
    </Accordion>
  );
};

export { CookiesCategories };
export type {
  CookieDetails,
  CookiesCategory,
  CookiesCategoryProvider,
  CookiesProvider,
};
