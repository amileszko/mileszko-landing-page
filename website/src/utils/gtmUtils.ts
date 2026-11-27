import { getWindow } from "@utils/windowUtils";

const googleTagManagerId = import.meta.env.VITE_GOOGLE_TAG_MANAGER_ID;

let loaded = false;

const analyticsCookiePrefixes = [
  "_ga",
  "_gat",
  "_gid",
];

const advertisingCookiePrefixes = [
  "_fbp",
  "_fbc",
  "_gac",
  "_gcl",
];

const clearTrackingCookies = ({
  clearAdvertising,
  clearAnalytics,
}: {
  clearAdvertising: boolean
  clearAnalytics: boolean
}): void => {
  const browserWindow = getWindow();

  if (!browserWindow) {
    return;
  }

  const prefixes = [
    ...(clearAnalytics ? analyticsCookiePrefixes : []),
    ...(clearAdvertising ? advertisingCookiePrefixes : []),
  ];

  for (const cookie of browserWindow.document.cookie.split(";")) {
    const name = cookie.split("=")[0]?.trim();

    if (!name || prefixes.every(prefix => !(name === prefix || name.startsWith(`${prefix}_`)))) {
      continue;
    }

    browserWindow.document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    browserWindow.document.cookie = `${name}=; Max-Age=0; path=/; domain=${browserWindow.location.hostname}; SameSite=Lax`;
  }
};

const loadGoogleTagManager = (): void => {
  const browserWindow = getWindow();

  if (!googleTagManagerId || loaded || !browserWindow) {
    return;
  }

  loaded = true;

  const dataLayer = browserWindow.dataLayer ?? [];
  browserWindow.dataLayer = dataLayer;

  const gtag: NonNullable<Window["gtag"]> = (
    command,
    action,
    parameters,
  ) => {
    dataLayer.push([
      command,
      action,
      parameters,
    ]);
  };

  browserWindow.gtag = gtag;

  gtag(
    "consent",
    "default",
    {
      ad_personalization: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      analytics_storage: "denied",
    },
  );

  dataLayer.push({
    "event": "gtm.js",
    "gtm.start": Date.now(),
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${googleTagManagerId}`;
  document.head.append(script);
};

export {
  clearTrackingCookies,
  loadGoogleTagManager,
};
