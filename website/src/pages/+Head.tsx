import "../styles.css";
import { usePageContext } from "vike-react/usePageContext";

const Head = () => {
  const { urlOriginal } = usePageContext();

  return (
    <>
      <meta content="/image.webp" property="og:image" />
      <meta content="/image.webp" name="twitter:image" />
      <meta content="summary_large_image" name="twitter:card" />
      <meta
        content="width=device-width,initial-scale=1,viewport-fit=cover"
        name="viewport"
      />
      {
        urlOriginal && (
          <link
            href={`${import.meta.env.VITE_HOST_NAME}${urlOriginal}`}
            rel="canonical"
          />
        )
      }
      <link href="/favicon.png" rel="icon" sizes="96x96" type="image/png" />
      <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      <link href="/favicon.ico" rel="shortcut icon" />
      <link
        href="/apple-touch-icon.png"
        rel="apple-touch-icon"
        sizes="180x180"
      />
      <link
        href="/apple-touch-icon-precomposed.png"
        rel="apple-touch-icon-precomposed"
        sizes="180x180"
      />
      <meta content="Mileszko" name="apple-mobile-web-app-title" />
      <meta content="#FAFAFA" name="theme-color" />
      <link href="/site.webmanifest" rel="manifest" />
      <link
        as="font"
        crossOrigin="anonymous"
        href="/fonts/inter-normal-latin-ext.woff2"
        rel="preload"
        type="font/woff2"
      />
      <link
        as="font"
        crossOrigin="anonymous"
        href="/fonts/inter-normal-latin.woff2"
        rel="preload"
        type="font/woff2"
      />
    </>
  );
};

export { Head };
