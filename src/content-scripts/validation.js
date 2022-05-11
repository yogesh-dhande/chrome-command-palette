export function validateUrl(urlString) {
  let url;

  try {
    if (urlString.startsWith("/")) {
      urlString = `${window.location.origin}${urlString}`;
    }
    url = new URL(urlString);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.href;
    }
  } catch (_) {
    return null;
  }
}
