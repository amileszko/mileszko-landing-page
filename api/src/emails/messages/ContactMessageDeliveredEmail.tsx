import { Heading, Hr, Link, Text } from "@react-email/components";

import { EmailLayout, Spacer } from "../components/EmailLayout";

const linkClassName =
  "inline cursor-pointer text-brand-500 no-underline duration-200 ease-in-out hover:text-brand-600 hover:underline";

const ContactMessageDeliveredEmail = () => (
  <EmailLayout
    footer={
      (
        <>
          <Text className="m-0 text-sm text-neutral-50">
            💡 W razie pytań czy wątpliwości — odpisz na ten mail lub złap
            mnie na
            {" "}
            <Link
              className={`${linkClassName} text-sm`}
              href="https://www.linkedin.com/in/amadeusz-mileszko/"
              rel="noopener noreferrer"
              target="_blank"
            >
              LinkedIn.
            </Link>
          </Text>
          <Spacer className="h-6" />
          <Text className="m-0 text-neutral-50">
            Pozdrawiam,
            <br />
            Amadeusz Mileszko
          </Text>
          <Spacer className="h-6" />
          <Hr
            className="m-0 h-px border-0 bg-neutral-800"
            data-skip-in-text="true"
          />
          <Spacer className="h-6" />
          <Text className="m-0 text-xs text-neutral-400">
            Administratorem danych osobowych jest Amadeusz Mileszko z siedzibą
            przy ul. Augustyna Szamarzewskiego 21, 60-514 Poznań, NIP
            2810095737. Więcej informacji na temat przetwarzania danych
            osobowych znajdziesz w mojej
            {" "}
            <Link
              className={`${linkClassName} text-xs`}
              href="https://mileszko.pl/polityki/polityka-prywatnosci"
              rel="noopener noreferrer"
              target="_blank"
            >
              polityce prywatności.
            </Link>
          </Text>
        </>
      )
    }
    preview="Twoja wiadomość już do mnie dotarła. Sprawdzam, co mogę dla Ciebie zrobić – i wrócę z odpowiedzią tak szybko, jak to możliwe."
    title="🚦 Szybka analiza i jasny plan w 24h — dziękuję za kontakt"
  >
    <Heading
      as="h1"
      className="m-0 font-heading text-h2 font-semibold text-neutral-800"
    >
      📬 Twoja wiadomość dotarła — czas na konkrety
    </Heading>
    <Spacer className="h-6" />
    <Text className="m-0 text-base text-neutral-800">
      Twój temat już do mnie dotarł. W ciągu 24 godzin odezwę się z roadmapą,
      propozycją działania lub moją diagnozą, jeśli coś byłoby poza zakresem.
      Nie tracisz czasu — zawsze dostajesz czarno na białym, co i jak.
    </Text>
    <Spacer className="h-6" />
    <Heading
      as="h3"
      className="m-0 font-heading text-h3 font-medium text-neutral-800"
    >
      🚀 Co możesz zrobić teraz?
    </Heading>
    <Spacer className="h-2" />
    <table
      cellPadding="0"
      cellSpacing="0"
      className="text-base text-neutral-800"
      width="100%"
    >
      <tbody>
        <tr>
          <td className="pl-4 pr-2 align-top">
            <span className="text-brand-600">→</span>
          </td>
          <td className="align-top">
            <Text className="m-0">
              Potrzebujesz NDA? Po prostu odeślij dane lub szablon — podpiszę
              przed wejściem w szczegóły.
            </Text>
            <Spacer className="h-2" />
          </td>
        </tr>
        <tr>
          <td className="pl-4 pr-2 align-top">
            <span className="text-brand-600">→</span>
          </td>
          <td className="align-top">
            <Text className="m-0">
              Chcesz przyspieszyć?
              {" "}
              <Link
                className={`${linkClassName} text-base`}
                href="https://cal.com/amadeusz-mileszko"
                rel="noopener noreferrer"
                target="_blank"
              >
                Umów krótką rozmowę
              </Link>
              {" "}
              — szybko sprawdzimy, w którym kierunku najlepiej pójść.
            </Text>
            <Spacer className="h-2" />
          </td>
        </tr>
        <tr>
          <td className="pl-4 pr-2 align-top">
            <span className="text-brand-600">→</span>
          </td>
          <td className="align-top">
            <Text className="m-0">
              Masz dodatkowe materiały? Doślij — każda informacja pomaga
              ustalić precyzyjny plan.
            </Text>
          </td>
        </tr>
      </tbody>
    </table>
    <Spacer className="h-6" />
    <Heading
      as="h3"
      className="m-0 font-heading text-h3 font-medium text-neutral-800"
    >
      ✍️ Sprawdź moje ostatnie notatki
    </Heading>
    <Spacer className="h-2" />
    <Text className="m-0 text-base text-neutral-800">
      Na blogu wrzucam praktyczne case’y: m.in. jak działać szybciej z MVP, jak
      realnie redukować koszty chmury, czy jakie lekcje wynoszę ze współpracy
      z founderami i CTO.
      {" "}
      <Link
        className={`${linkClassName} text-base`}
        href="https://mileszko.pl/blog"
        rel="noopener noreferrer"
        target="_blank"
      >
        Zobacz wpisy
      </Link>
      {" "}
      — znajdziesz tam konkretne porady i rozwiązania, które wdrażam u klientów.
    </Text>
  </EmailLayout>
);

export { ContactMessageDeliveredEmail };
