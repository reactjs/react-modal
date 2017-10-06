import findTabbable from "./tabbable";

export default function scopeTab(node, event) {
  const tabbable = findTabbable(node);

  if (!tabbable.length) {
    // Do nothing, since there are no elements that can receive focus.
    event.preventDefault();
    return;
  }

  const shiftKey = event.shiftKey;
  const head = tabbable[0];
  const tail = tabbable[tabbable.length - 1];

  // proceed with default browser behavior
  if (node === document.activeElement) {
    return;
  }

  var target;
  if (tail === document.activeElement && !shiftKey) {
    target = head;
  }

  if (head === document.activeElement && shiftKey) {
    target = tail;
  }

  if (target) {
    event.preventDefault();
    target.focus();
    return;
  }

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
  const isSafariDesktop =
    checkSafari != null &&
    checkSafari[1] != "Chrome" &&
    /\biPod\b|\biPad\b/g.exec(navigator.userAgent) == null;

  // If we are not in safari desktop, let the browser control
  // the focus
  if (!isSafariDesktop) return;

  var x = tabbable.indexOf(document.activeElement);

  if (x > -1) {
    x += shiftKey ? -1 : 1;
  }

  event.preventDefault();

  tabbable[x].focus();
}
