/*!
 * Adapted from jQuery UI core
 *
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */

const tabbableNode = /input|select|textarea|button|object/;

function hidesContents(element) {
  const zeroSize = element.offsetWidth <= 0 && element.offsetHeight <= 0;

  // If the node is empty, this is good enough
  if (zeroSize && !element.innerHTML) return true;

  try {
    // Otherwise we need to check some styles
    const style = window.getComputedStyle(element);
    return zeroSize
      ? style.getPropertyValue("overflow") !== "visible" ||
          // if 'overflow: visible' set, check if there is actually any overflow
          (element.scrollWidth <= 0 && element.scrollHeight <= 0)
      : style.getPropertyValue("display") == "none";
  } catch (exception) {
    // eslint-disable-next-line no-console
    console.warn("Failed to inspect element style");
    return false;
  }
}

function visible(element) {
  let parentElement = element;
  let rootNode = element.getRootNode && element.getRootNode();
  while (parentElement) {
    if (parentElement === document.body) break;
    if (rootNode && parentElement === rootNode) parentElement = rootNode.host;
    if (hidesContents(parentElement)) return false;
    parentElement = parentElement.parentNode;
  }
  return true;
}

function focusable(element, isTabIndexNotNaN) {
  const nodeName = element.nodeName.toLowerCase();
  const res =
    (tabbableNode.test(nodeName) && !element.disabled) ||
    (nodeName === "a" ? element.href || isTabIndexNotNaN : isTabIndexNotNaN);
  return res && visible(element);
}

function tabbable(element) {
  let tabIndex = element.getAttribute("tabindex");
  if (tabIndex === null) tabIndex = undefined;
  const isTabIndexNaN = isNaN(tabIndex);
  return (isTabIndexNaN || tabIndex >= 0) && focusable(element, !isTabIndexNaN);
}

export default function findTabbableDescendants(element) {
  return [].slice.call(element.querySelectorAll("*"), 0).filter(tabbable);
}
