function validateElement (appElement) {
  if (!appElement) {
    throw new Error('react-modal: Setting an getAppElement function is required');
  }
}

export function toggle (appElement, value) {
  validateElement(appElement);
  if (Array.isArray(appElement)) {
    appElement.forEach((ae) => {
      ae.setAttribute('aria-hidden', value);
    });
  } else {
    appElement.setAttribute('aria-hidden', value);
  }
}

export function hide (appElement) {
  toggle(appElement, true);
}

export function show (appElement) {
  toggle(appElement, false);
}
