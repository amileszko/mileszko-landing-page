import { Heading, Hr, Link, Text } from "@react-email/components";

import { EmailLayout, Spacer } from "../components/EmailLayout";

const linkClassName =
  "inline cursor-pointer text-brand-500 no-underline duration-200 ease-in-out hover:text-brand-600 hover:underline";

const ContactMessageNotificationEmail = () => (
  <EmailLayout
    footer={
      (
        <>
          <Text className="m-0 text-sm text-neutral-50">
            To wiadomość systemowa zawierająca dane osobowe przesłane przez
            użytkownika formularza kontaktowego. Pamiętaj o zachowaniu poufności
            i przetwarzaniu zgodnie z obowiązującymi uprawnieniami oraz polityką
            danych osobowych.
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
    preview="Użytkownik przesłał nową wiadomość przez formularz. Sprawdź treść zgłoszenia i podejmij działania zgodnie z procedurą."
    title="🚨 Nowa wiadomość z formularza — sprawdź szczegóły"
  >
    <Text className="m-0 text-xs uppercase tracking-wide text-neutral-800">
      🚨 Uwaga! Wiadomość systemowa – tylko do użytku wewnętrznego.
    </Text>
    <Spacer className="h-8" />
    <Heading
      as="h1"
      className="m-0 font-heading text-h2 font-semibold text-neutral-800"
    >
      📋 Nowe zgłoszenie czeka na Twoją uwagę
    </Heading>
    <Spacer className="h-6" />
    <Text className="m-0 text-base text-neutral-800">
      Ktoś właśnie wypełnił formularz kontaktowy – warto się temu przyjrzeć:
    </Text>
    <Spacer className="h-6" />
    <Heading
      as="h3"
      className="m-0 font-heading text-h3 font-medium text-neutral-800"
    >
      📧 Email:
    </Heading>
    <Spacer className="h-2" />
    <Text className="m-0 text-base text-neutral-800">
      <i>{"{{ email }}"}</i>
    </Text>
    <Spacer className="h-4" />
    <Heading
      as="h3"
      className="m-0 font-heading text-h3 font-medium text-neutral-800"
    >
      📝 Temat:
    </Heading>
    <Spacer className="h-2" />
    <Text className="m-0 text-base text-neutral-800">
      <i>{"{{ topic }}"}</i>
    </Text>
    <Spacer className="h-4" />
    <Heading
      as="h3"
      className="m-0 font-heading text-h3 font-medium text-neutral-800"
    >
      📄 Opis:
    </Heading>
    <Spacer className="h-2" />
    <Text className="m-0 text-base text-neutral-800">
      <i>{"{{ description }}"}</i>
    </Text>
    <Spacer className="h-4" />
    <Heading
      as="h3"
      className="m-0 font-heading text-h3 font-medium text-neutral-800"
    >
      🤝 Preferowany model współpracy:
    </Heading>
    <Spacer className="h-2" />
    <Text className="m-0 text-base text-neutral-800">
      <i>{"{{ cooperation }}"}</i>
    </Text>
    <Spacer className="h-4" />
    <Heading
      as="h3"
      className="m-0 font-heading text-h3 font-medium text-neutral-800"
    >
      📎 Załączniki:
    </Heading>
    <Spacer className="h-2" />
    <Text className="m-0 text-base text-neutral-800">
      <i>{"{{ attachments }}"}</i>
    </Text>
    <Spacer className="h-4" />
    <Heading
      as="h3"
      className="m-0 font-heading text-h3 font-medium text-neutral-800"
    >
      🔒 Dane do NDA:
    </Heading>
    <Spacer className="h-2" />
    <Text className="m-0 text-base text-neutral-800">
      <i>{"{{ nda }}"}</i>
    </Text>
    <Spacer className="h-6" />
    <Text className="m-0 text-base text-neutral-800">
      Zgłoszenie zostało zapisane w systemie. Zweryfikuj i przypisz, jeśli
      potrzebna jest dalsza obsługa.
    </Text>
  </EmailLayout>
);

export { ContactMessageNotificationEmail };
