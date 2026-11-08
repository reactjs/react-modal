import warning from "warning";
import { canUseDOM } from "./safeHTMLElement";

let globalElement = null;
let hiddenElements = new Map();

/* eslint-disable no-console */
/* istanbul ignore next */
export function resetState() {
  hiddenElements.clear();
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
  const elements = Array.prototype.slice.call(validateElement(appElement));
  for (let el of elements) {
    const previous = hiddenElements.get(el);
    if (previous) {
      previous.count += 1;
    } else {
      hiddenElements.set(el, {
        count: 1,
        value: el.getAttribute("aria-hidden")
      });
    }
    el.setAttribute("aria-hidden", "true");
  }
  return elements;
}

export function show(appElement) {
  for (let el of validateElement(appElement)) {
    const previous = hiddenElements.get(el);
    if (!previous) continue;
    previous.count -= 1;
    if (previous.count === 0) {
      if (previous.value === null) {
        el.removeAttribute("aria-hidden");
      } else {
        el.setAttribute("aria-hidden", previous.value);
      }
      hiddenElements.delete(el);
    }
  }
}

export function documentNotReadyOrSSRTesting() {
  globalElement = null;
}
