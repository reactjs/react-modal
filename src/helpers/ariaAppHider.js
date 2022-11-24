import { canUseDOM } from "./safeHTMLElement";

let globalElement = null;

/* eslint-disable no-console */
/* istanbul ignore next */
export function resetState() {
  if (globalElement) {
    if (globalElement.removeAttribute) {
      globalElement.removeAttribute("aria-hidden");
    } else if (globalElement.length != null) {
      globalElement.forEach(element => element.removeAttribute("aria-hidden"));
    } else {
      document
        .querySelectorAll(globalElement)
        .forEach(element => element.removeAttribute("aria-hidden"));
    }
  }
  globalElement = null;
}

/* istanbul ignore next */
export function log() {
  if (process.env.NODE_ENV !== "production") {
    var check = globalElement || {};
    console.log("ariaAppHider ----------");
    console.log(check.nodeName, check.className, check.id);
    console.log("end ariaAppHider ----------");
  }
}
/* eslint-enable no-console */

export function assertNodeList(nodeList, selector) {
  if (!nodeList || !nodeList.length) {
    throw new Error(
      `react-modal: No elements were found for selector ${selector}.`
    );
  }
}

export function validateElement(element) {
  if (!element || element.length == 0) {
    // eslint-disable-next-line no-console
    throw new Error(
      [
        "react-modal: App element is not defined.",
        "Please use `Modal.setAppElement(el)` or set `appElement={el}`."
      ].join(" ")
    );
  }

  return Array.isArray(element) ||
    element instanceof HTMLCollection ||
    element instanceof NodeList
    ? element
    : [element];
}

export function setElement(element) {
  if (!canUseDOM) return;
  globalElement =
    (typeof element === "string" && document.querySelectorAll(element)) ||
    ((element instanceof HTMLElement) && [element]) ||
    globalElement;
  validateElement(globalElement);
  return globalElement;
}

export function hide(appElement) {
  for (let el of validateElement(appElement || globalElement)) {
    el.setAttribute("aria-hidden", "true");
  }
}

export function show(appElement) {
  for (let el of validateElement(appElement || globalElement)) {
    el.removeAttribute("aria-hidden");
  }
}

export function documentNotReadyOrSSRTesting() {
  globalElement = null;
}
