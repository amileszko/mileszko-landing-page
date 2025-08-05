import "../styles.css";
import { usePageContext } from "vike-react/usePageContext";

const Head = () => {
  const { urlOriginal } = usePageContext();

  return (
    <>
      {
        import.meta.env.VITE_GOOGLE_TAG_MANAGER_ID && (
          <>
            <script
              // eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml
              dangerouslySetInnerHTML={
                {
                  __html:
                    `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied'
});
`,
                }
              }
            />
            <script
              // eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml
              dangerouslySetInnerHTML={
                {
                  __html:
                    `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${import.meta.env.VITE_GOOGLE_TAG_MANAGER_ID}');`,
                }
              }
            />
          </>
        )
      }
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
        crossOrigin="anonymous"
        href="https://fonts.gstatic.com"
        rel="preconnect"
      />
      <link
        as="font"
        crossOrigin="anonymous"
        href="https://fonts.gstatic.com/s/inter/v19/UcCm3FwrK3iLTcvnUwoT9mI1F55MKw.woff2"
        rel="preload"
        type="font/woff2"
      />
      <link
        as="font"
        crossOrigin="anonymous"
        href="https://fonts.gstatic.com/s/inter/v19/UcCm3FwrK3iLTcvnUwQT9mI1F54.woff2"
        rel="preload"
        type="font/woff2"
      />
      <link
        as="font"
        crossOrigin="anonymous"
        href="https://fonts.gstatic.com/s/inter/v19/UcCo3FwrK3iLTcvsYwYZ8UA3J58.woff2"
        rel="preload"
        type="font/woff2"
      />
      <link
        as="font"
        crossOrigin="anonymous"
        href="https://fonts.gstatic.com/s/inter/v19/UcCo3FwrK3iLTcviYwYZ8UA3.woff2"
        rel="preload"
        type="font/woff2"
      />
    </>
  );
};

export { Head };
