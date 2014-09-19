var _element = null;

function setElement(element) {
  _element = element;
}

function hide(appElement) {
  validateElement();
  (appElement || _element).setAttribute('aria-hidden', 'true');
}

function show(appElement) {
  validateElement();
  (appElement || _element).removeAttribute('aria-hidden');
}

function toggle(shouldHide, appElement) {
  if (shouldHide) hide(appElement); else show(appElement);
}

function validateElement() {
  if (!_element)
    throw new Error('react-modal: You must set an element with `Modal.setAppElement(el)` to make this accessible');
}

exports.toggle = toggle;
exports.setElement = setElement;
exports.show = show;
exports.hide = hide;

