let htmlClassList = {};
let docBodyClassList = {};

/* eslint-disable no-console */
/* istanbul ignore next */
function removeClass(at, cls) {
  at.classList.remove(cls);
}

/* istanbul ignore next */
export function resetState() {
  const htmlElement = document.getElementsByTagName("html")[0];
  for (let cls in htmlClassList) {
    removeClass(htmlElement, htmlClassList[cls]);
  }

  const body = document.body;
  for (let cls in docBodyClassList) {
    removeClass(body, docBodyClassList[cls]);
  }

  htmlClassList = {};
  docBodyClassList = {};
}

/* istanbul ignore next */
export function log() {
  if (process.env.NODE_ENV !== "production") {
    let classes = document.getElementsByTagName("html")[0].className;
    let buffer = "Show tracked classes:\n\n";

    buffer += `<html /> (${classes}):
  `;
    for (let x in htmlClassList) {
      buffer += `  ${x} ${htmlClassList[x]}
  `;
    }

    classes = document.body.className;

    buffer += `\n\ndoc.body (${classes}):
  `;
    for (let x in docBodyClassList) {
      buffer += `  ${x} ${docBodyClassList[x]}
  `;
    }

    buffer += "\n";

    console.log(buffer);
  }
}
/* eslint-enable no-console */

/**
 * Track the number of reference of a class.
 * @param {object} poll The poll to receive the reference.
 * @param {string} className The class name.
 * @return {string}
 */
const incrementReference = (poll, className) => {
  if (!poll[className]) {
    poll[className] = 0;
  }
  poll[className] += 1;
  return className;
};

/**
 * Drop the reference of a class.
 * @param {object} poll The poll to receive the reference.
 * @param {string} className The class name.
 * @return {string}
 */
const decrementReference = (poll, className) => {
  if (poll[className]) {
    poll[className] -= 1;
  }
  return className;
};

/**
 * Track a class and add to the given class list.
 * @param {Object} classListRef A class list of an element.
 * @param {Object} poll         The poll to be used.
 * @param {Array}  classes      The list of classes to be tracked.
 */
const trackClass = (classListRef, poll, classes) => {
  classes.forEach(className => {
    incrementReference(poll, className);
    classListRef.add(className);
  });
};

/**
 * Untrack a class and remove from the given class list if the reference
 * reaches 0.
 * @param {Object} classListRef A class list of an element.
 * @param {Object} poll         The poll to be used.
 * @param {Array}  classes      The list of classes to be untracked.
 */
const untrackClass = (classListRef, poll, classes) => {
  classes.forEach(className => {
    decrementReference(poll, className);
    poll[className] === 0 && classListRef.remove(className);
  });
};

/**
 * Public inferface to add classes to the document.body.
 * @param {string} bodyClass The class string to be added.
 *                           It may contain more then one class
 *                           with ' ' as separator.
 */
export const add = (element, classString) =>
  trackClass(
    element.classList,
    element.nodeName.toLowerCase() == "html" ? htmlClassList : docBodyClassList,
    classString.split(" ")
  );

/**
 * Public inferface to remove classes from the document.body.
 * @param {string} bodyClass The class string to be added.
 *                           It may contain more then one class
 *                           with ' ' as separator.
 */
export const remove = (element, classString) =>
  untrackClass(
    element.classList,
    element.nodeName.toLowerCase() == "html" ? htmlClassList : docBodyClassList,
    classString.split(" ")
  );
