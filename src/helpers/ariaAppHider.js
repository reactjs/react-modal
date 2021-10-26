import warning from "warning";
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

export function setElement(element) {
  let useElement = element;
  if (typeof useElement === "string" && canUseDOM) {
    const el = document.querySelectorAll(useElement);
    assertNodeList(el, useElement);
    useElement = el;
  }
  globalElement = useElement || globalElement;
  return globalElement;
}

export function validateElement(appElement) {
  const el = appElement || globalElement;
  if (el) {
    return Array.isArray(el) ||
      el instanceof HTMLCollection ||
      el instanceof NodeList
      ? el
      : [el];
  } else {
    warning(
      false,
      [
        "react-modal: App element is not defined.",
        "Please use `Modal.setAppElement(el)` or set `appElement={el}`.",
        "This is needed so screen readers don't see main content",
        "when modal is opened. It is not recommended, but you can opt-out",
        "by setting `ariaHideApp={false}`."
      ].join(" ")
    );

    return [];
  }
}

export function hide(appElement) {
  for (let el of validateElement(appElement)) {
    el.setAttribute("aria-hidden", "true");
  }
}

export function show(appElement) {
  for (let el of validateElement(appElement)) {
    el.removeAttribute("aria-hidden");
  }
}

export function documentNotReadyOrSSRTesting() {
  globalElement = null;
}
