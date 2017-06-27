let globalElement = null;

export function assertNodeList(nodeList, selector) {
  if (!nodeList || !nodeList.length) {
    throw new Error(
      `react-modal: No elements were found for selector ${selector}.`
    );
  }
}

export function setElement(element) {
  let useElement = element;
  if (typeof useElement === 'string') {
    const el = document.querySelectorAll(useElement);
    assertNodeList(el, useElement);
    useElement = 'length' in el ? el[0] : el;
  }
  globalElement = useElement || globalElement;
  return globalElement;
}

export function tryForceFallback() {
  if (document && document.body) {
    // force fallback to document.body
    setElement(document.body);
    return true;
  }
  return false;
}

export function validateElement(appElement) {
  if (!appElement && !globalElement && !tryForceFallback()) {
    throw new Error([
      'react-modal: Cannot fallback to `document.body`, because it\'s not ready or available.',
      'If you are doing server-side rendering, use this function to defined an element.',
      '`Modal.setAppElement(el)` to make this accessible'
    ]);
  }
}

export function hide(appElement) {
  validateElement(appElement);
  (appElement || globalElement).setAttribute('aria-hidden', 'true');
}

export function show(appElement) {
  validateElement(appElement);
  (appElement || globalElement).removeAttribute('aria-hidden');
}

export function documentNotReadyOrSSRTesting() {
  globalElement = null;
}

export function resetForTesting() {
  globalElement = document.body;
}
