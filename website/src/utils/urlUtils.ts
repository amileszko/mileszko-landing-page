const getUrlPathName = (url: string): string => {
  let path = url;

  try {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      const urlObj = new URL(url);
      path = urlObj.pathname;
    }
    else if (url.startsWith("//")) {
      const urlObj = new URL(`https:${url}`);
      path = urlObj.pathname;
    }
  }
  catch {
    return url.split("?")[0];
  }

  return path.split("?")[0];
};

const getUrlSearchParams = (url: string): Record<string, string> => {
  const splitUrl = url.split("?");

  if (splitUrl.length === 1) {
    return {};
  }

  const urlParams = new URLSearchParams(splitUrl[1]);

  return Object.fromEntries(urlParams.entries());
};

const normalizeUrl = (url: string): string => {
  return "/" + url.split("/")
    .filter(Boolean)
    .join("/");
};

export { getUrlPathName, getUrlSearchParams, normalizeUrl };
