let globalElement = typeof document !== 'undefined' ? document.body : null;

function validateElement (appElement) {
  if (!appElement && !globalElement) {
    throw new Error('react-modal: You must set an element with `Modal.setAppElement(el)` to make this accessible');
  }
}

export function setElement (element) {
  let newElement = element;
  if (typeof newElement === 'string') {
    const el = document.querySelectorAll(element);
    newElement = 'length' in el ? el[0] : el;
  }
  globalElement = newElement || globalElement;
  return globalElement;
}

export function hide (appElement) {
  validateElement(appElement);
  (appElement || globalElement).setAttribute('aria-hidden', 'true');
}

export function show (appElement) {
  validateElement(appElement);
  (appElement || globalElement).removeAttribute('aria-hidden');
}

export function toggle (shouldHide, appElement) {
  if (shouldHide) {
    hide(appElement);
  } else { show(appElement); }
}

export function resetForTesting () {
  globalElement = document.body;
}
