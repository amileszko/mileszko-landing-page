/* eslint-disable unicorn/no-for-loop */
// eslint-disable-next-line no-unused-vars
function handler(event) {
  var request = event.request;
  var headers = request.headers;
  var originalUri = request.uri;
  var normalizedUri = normalizeUri(request.uri);
  var originalQueryString = serializeQueryString(request.querystring);
  var normalizedQueryString = normalizeQueryString(request.querystring);
  var originalHost = headers.host.value;
  var nonWwwHost = originalHost.startsWith("www.") ? originalHost.slice(4) : originalHost;

  if (normalizedUri !== originalUri ||
    nonWwwHost !== originalHost ||
    normalizedQueryString !== originalQueryString) {
    return {
      headers: { location: { value: "https://" + nonWwwHost + normalizedUri + normalizedQueryString } },
      statusCode: 301,
      statusDescription: "Moved Permanently",
    };
  }

  if (normalizedUri === "/" || normalizedUri.includes(".")) {
    return request;
  }

  request.uri = normalizedUri + "/index.html";

  return request;
}

function normalizeQueryString(querystring) {
  if (!querystring || Object.keys(querystring).length === 0) {
    return "";
  }

  var qs = [];
  var keys = Object.keys(querystring)
    .sort();

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];

    if (querystring[key].multiValue) {
      var values = querystring[key].multiValue.map(
        mv => mv.value,
      )
        .sort();

      for (var j = 0; j < values.length; j++) {
        qs.push(encodeURIComponent(key) + "=" + encodeURIComponent(values[j]));
      }
    }
    else {
      qs.push(encodeURIComponent(key) + "=" + encodeURIComponent(querystring[key].value));
    }
  }
  return "?" + qs.join("&");
}

function normalizeUri(uri) {
  // eslint-disable-next-line unicorn/prefer-string-replace-all
  uri = uri.replace(
    new RegExp(
      "/+",
      "g",
    ),
    "/",
  );

  var parts = uri.split("/");

  for (var i = 0; i < parts.length; i++) {
    if (parts[i] && !parts[i].includes(".")) {
      parts[i] = parts[i].toLowerCase();
    }
  }

  uri = parts.join("/");

  if (uri.length > 1 && uri.endsWith("/")) {
    uri = uri.slice(
      0,
      -1,
    );
  }

  return uri;
}

function serializeQueryString(querystring) {
  if (!querystring || Object.keys(querystring).length === 0) {
    return "";
  }

  var qs = [];
  var keys = Object.keys(querystring);

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];

    if (querystring[key].multiValue) {
      var values = querystring[key].multiValue.map(
        mv => mv.value,
      );

      for (var j = 0; j < values.length; j++) {
        qs.push(encodeURIComponent(key) + "=" + encodeURIComponent(values[j]));
      }
    }
    else {
      qs.push(encodeURIComponent(key) + "=" + encodeURIComponent(querystring[key].value));
    }
  }
  return "?" + qs.join("&");
}
