import { Accordion } from "../Accordion/Accordion";
import { AccordionContent } from "../Accordion/AccordionContent";
import { AccordionItem } from "../Accordion/AccordionItem";
import { Badge } from "../Badge/Badge";
import { SmallBlock } from "../Block";
import { Card } from "../Card";
import { H4 } from "../Header";
import { Link } from "../Link";
import { Cookies } from "./Cookies";
import { CookiesAccordionTrigger } from "./CookiesAccordionTrigger";
import { type CookiesCategoryProvider } from "./CookiesCategories";

interface CookiesProvidersProps {
  cookiesCategoryProviders: CookiesCategoryProvider[]
}

const CookiesProviders = ({ cookiesCategoryProviders }:
CookiesProvidersProps) => {
  return (
    <Accordion>
      {
        cookiesCategoryProviders.map(provider => (
          <AccordionItem
            key={provider.provider.name}
            value={provider.provider.name}
          >
            <Card>
              <SmallBlock>
                <SmallBlock className="flex-row items-center">
                  <H4>{provider.provider.name}</H4>
                  <Badge className="flex size-6 items-center justify-center p-0">
                    {provider.cookies.length}
                  </Badge>
                  <CookiesAccordionTrigger />
                </SmallBlock>
                <Link
                  href={provider.provider.url}
                  rel="noopener noreferrer"
                  target="_blank"
                  variant="cta-link"
                >
                  {provider.provider.url}
                </Link>
              </SmallBlock>

              <AccordionContent className="mt-6">
                <Cookies cookies={provider.cookies} />
              </AccordionContent>
            </Card>
          </AccordionItem>
        ))
      }
    </Accordion>
  );
};

export { CookiesProviders };
