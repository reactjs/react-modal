let _element = typeof document !== 'undefined' ? document.body : null;

export function setElement(element) {
  if (typeof element === 'string') {
    const el = document.querySelectorAll(element);
    element = 'length' in el ? el[0] : el;
  }
  _element = element || _element;
  return _element;
}

export function hide(appElement) {
  validateElement(appElement);
  (appElement || _element).setAttribute('aria-hidden', 'true');
}

export function show(appElement) {
  validateElement(appElement);
  (appElement || _element).removeAttribute('aria-hidden');
}

export function toggle(shouldHide, appElement) {
  const apply = shouldHide ? hide : show;
  apply(appElement);
}

export function validateElement(appElement) {
  if (!appElement && !_element) {
    throw new Error('react-modal: You must set an element with `Modal.setAppElement(el)` to make this accessible');
  }
}

export function resetForTesting() {
  _element = document.body;
}


