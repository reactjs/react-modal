let globalElement = typeof document !== 'undefined' ? document.body : null;

export function setElement(element) {
  let useElement = element;
  if (typeof useElement === 'string') {
    const el = document.querySelectorAll(useElement);
    useElement = 'length' in el ? el[0] : el;
  }
  globalElement = useElement || globalElement;
  return globalElement;
}

export function validateElement(appElement) {
  if (!appElement && !globalElement) {
    throw new Error([
      'react-modal: You must set an element with',
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

export function toggle(shouldHide, appElement) {
  const apply = shouldHide ? hide : show;
  apply(appElement);
}

export function resetForTesting() {
  globalElement = document.body;
}
