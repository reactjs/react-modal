// Safari radio issue.
//
// Safari does not move the focus to the radio button,
// so we need to force it to really walk through all elements.
//
// This is very error prune, since we are trying to guess
// if it is a safari browser from the first occurence between
// chrome or safari.
//
// The chrome user agent contains the first ocurrence
// as the 'chrome/version' and later the 'safari/version'.
const checkSafari = /(\bChrome\b|\bSafari\b)\//.exec(navigator.userAgent);
export const isSafariDesktop =
  checkSafari != null &&
  checkSafari[1] != "Chrome" &&
  /\biPod\b|\biPad\b/g.exec(navigator.userAgent) == null;
