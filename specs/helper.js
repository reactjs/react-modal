import React from "react";
import ReactDOM from "react-dom";
import Modal, { bodyOpenClassName } from "../src/components/Modal";
import TestUtils from "react-dom/test-utils";
import { log as classListLog } from "../src/helpers/classList";
import { log as focusManagerLog } from "../src/helpers/focusManager";
import { log as ariaAppLog } from "../src/helpers/ariaAppHider";
import { log as bodyTrapLog } from "../src/helpers/bodyTrap";
import { log as portalInstancesLog } from "../src/helpers/portalOpenInstances";

const debug = false;

let i = 0;

/**
 * This log is used to see if there are leaks in between tests.
 */
export function log(label, spaces) {
  if (!debug) return;

  console.log(`${label} -----------------`);
  console.log(document.body.children.length);
  const logChildren = c => console.log(c.nodeName, c.className, c.id);
  document.body.children.forEach(logChildren);

  ariaAppLog();
  bodyTrapLog();
  classListLog();
  focusManagerLog();
  portalInstancesLog();

  console.log(`end ${label} -----------------` + (!spaces ? '' : `


`));
}

let elementPool = [];

/**
 * Every HTMLElement must be requested using this function...
 * and inside `withElementCollector`.
 */
export function createHTMLElement(name) {
  const e = document.createElement(name);
  elementPool[elementPool.length - 1].push(e);
  e.className = `element_pool_${name}-${++i}`;
  return e;
}

/**
 * Remove every element from its parent and release the pool.
 */
export function drainPool(pool) {
  pool.forEach(e => e.parentNode && e.parentNode.removeChild(e));
}

/**
 * Every HTMLElement must be requested inside this function...
 * The reason is that it provides a mechanism that disposes
 * all the elements (built with `createHTMLElement`) after a test.
 */
export function withElementCollector(work) {
  let r;
  let poolIndex = elementPool.length;
  elementPool[poolIndex] = [];
  try {
    r = work();
  } finally {
    drainPool(elementPool[poolIndex]);
    elementPool = elementPool.slice(
      0, poolIndex
    );
  }
  return r;
}

/**
 * Polyfill for String.includes on some node versions.
 */
if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    if (typeof start !== "number") {
      start = 0;
    }

    if (start + search.length > this.length) {
      return false;
    }

    return this.indexOf(search, start) !== -1;
  };
}

/**
 * Return the class list object from `document.body`.
 * @return {Array}
 */
export const documentClassList = () => document.body.classList;

/**
 * Check if the document.body contains the react modal
 * open class.
 * @return {Boolean}
 */
export const isDocumentWithReactModalOpenClass = (
  bodyClass = bodyOpenClassName
) => document.body.className.includes(bodyClass);

/**
 * Return the class list object from <html />.
 * @return {Array}
 */
export const htmlClassList = () =>
  document.getElementsByTagName("html")[0].classList;

/**
 * Check if the html contains the react modal
 * open class.
 * @return {Boolean}
 */
export const isHtmlWithReactModalOpenClass = htmlClass =>
  htmlClassList().contains(htmlClass);

/**
 * Returns a rendered dom element by class.
 * @param {React} element A react instance.
 * @param {String}     className A class to find.
 * @return {DOMElement}
 */
export const findDOMWithClass = TestUtils.findRenderedDOMComponentWithClass;

/**
 * Returns an attribut of a rendered react tree.
 * @param {React} component A react instance.
 * @return {String}
 */
const getModalAttribute = component => (instance, attr) =>
  modalComponent(component)(instance).getAttribute(attr);

/**
 * Return an element from a react component.
 * @param {React} A react instance.
 * @return {DOMElement}
 */
const modalComponent = component => instance => instance.portal[component];

/**
 * Returns the modal content.
 * @param {Modal} modal Modal instance.
 * @return {DOMElement}
 */
export const mcontent = modalComponent("content");

/**
 * Returns the modal overlay.
 * @param {Modal} modal Modal instance.
 * @return {DOMElement}
 */
export const moverlay = modalComponent("overlay");

/**
 * Return an attribute of modal content.
 * @param {Modal} modal Modal instance.
 * @return {String}
 */
export const contentAttribute = getModalAttribute("content");

/**
 * Return an attribute of modal overlay.
 * @param {Modal} modal Modal instance.
 * @return {String}
 */
export const overlayAttribute = getModalAttribute("overlay");

const Simulate = TestUtils.Simulate;

const dispatchMockEvent = eventCtor => (key, code) => (element, opts) =>
  eventCtor(
    element,
    Object.assign(
      {},
      {
        key: key,
        which: code
      },
      code,
      opts
    )
  );

const dispatchMockKeyDownEvent = dispatchMockEvent(Simulate.keyDown);

/**
 * @deprecated will be replaced by `escKeyDownWithCode` when `react-modal`
 * drops support for React <18.
 *
 * Dispatch an 'esc' key down event using the legacy KeyboardEvent.keyCode.
 */
export const escKeyDown = dispatchMockKeyDownEvent("ESC", { keyCode: 27 });
/**
 * Dispatch an 'esc' key down event.
 */
export const escKeyDownWithCode = dispatchMockKeyDownEvent("ESC", {
  code: "Escape"
});
/**
 * @deprecated will be replaced by `escKeyDownWithCode` when `react-modal`
 * drops support for React <18.
 *
 * Dispatch a 'tab' key down event using the legacy KeyboardEvent.keyCode.
 */
export const tabKeyDown = dispatchMockKeyDownEvent("TAB", { keyCode: 9 });
/**
 * Dispatch a 'tab' key down event.
 */
export const tabKeyDownWithCode = dispatchMockKeyDownEvent("TAB", {
  code: "Tab"
});
/**
 * Dispatch a 'click' event at a node.
 */
export const clickAt = Simulate.click;
/**
 * Dispatch a 'mouse up' event at a node.
 */
export const mouseUpAt = Simulate.mouseUp;
/**
 * Dispatch a 'mouse down' event at a node.
 */
export const mouseDownAt = Simulate.mouseDown;

export const noop = () => {};

/**
 * Request a managed modal to run the tests on.
 *
 */
export const withModal = function(props, children, test = noop) {
  return withElementCollector(() => {
    const node = createHTMLElement();
    const modalProps = { ariaHideApp: false, ...props };
    let modal;
    try {
      ReactDOM.render(
        <Modal ref={m => (modal = m)} {...modalProps}>
          {children}
        </Modal>,
        node
      );
      test(modal);
    } finally {
      ReactDOM.unmountComponentAtNode(node);
    }
  });
};
