let globalElement = typeof document !== 'undefined' ? document.body : null;

function setElement (element) {
  let newElement = element;
  if (typeof newElement === 'string') {
    const el = document.querySelectorAll(element);
    newElement = 'length' in el ? el[0] : el;
  }
  globalElement = newElement || globalElement;
  return globalElement;
}

function validateElement (appElement) {
  if (!appElement && !globalElement) {
    throw new Error('react-modal: You must set an element with `Modal.setAppElement(el)` to make this accessible');
  }
}

function hide (appElement) {
  validateElement(appElement);
  (appElement || globalElement).setAttribute('aria-hidden', 'true');
}

function show (appElement) {
  validateElement(appElement);
  (appElement || globalElement).removeAttribute('aria-hidden');
}

function toggle (shouldHide, appElement) {
  if (shouldHide) {
    hide(appElement);
  } else { show(appElement); }
}

function resetForTesting () {
  globalElement = document.body;
}

exports.toggle = toggle;
exports.setElement = setElement;
exports.show = show;
exports.hide = hide;
exports.resetForTesting = resetForTesting;
