/* eslint-disable no-unused-vars */
function getExtension(uri) {
  var lastDot = uri.lastIndexOf(".");

  return lastDot === -1 ?
    "" :
    uri.slice(lastDot + 1)
      .toLowerCase();
}

function handler(event) {
  var request = event.request;
  var response = event.response;
  var uri = request.uri;
  var extension = getExtension(uri);
  var cacheControl = "public, max-age=3600";

  if (uri === "/" || extension === "html" || extension === "") {
    cacheControl = "no-cache";
  }
  else if (uri.indexOf("/assets/") === 0) {
    cacheControl = "public, max-age=31536000, immutable";
  }
  else if (uri.indexOf("/fonts/") === 0) {
    cacheControl = "public, max-age=2592000";
  }
  else if (extension === "mp4" || isImageExtension(extension)) {
    cacheControl = "public, max-age=604800";
  }

  response.headers["cache-control"] = { value: cacheControl };

  if (extension === "webp") {
    response.headers["content-type"] = { value: "image/webp" };
  }
  else if (extension === "woff2") {
    response.headers["content-type"] = { value: "font/woff2" };
  }

  return response;
}

function isImageExtension(extension) {
  return [
    "gif",
    "ico",
    "jpeg",
    "jpg",
    "png",
    "svg",
    "webp",
  ].includes(extension);
}
