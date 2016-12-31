import findTabbable from './tabbable';

let modalElement = null;
let focusLaterElement = null;
let needToFocus = false;

function handleBlur () {
  needToFocus = true;
}

function handleFocus () {
  if (needToFocus) {
    needToFocus = false;
    if (!modalElement) {
      return;
    }
    // need to see how jQuery shims document.on('focusin') so we don't need the
    // setTimeout, firefox doesn't support focusin, if it did, we could focus
    // the element outside of a setTimeout. Side-effect of this implementation
    // is that the document.body gets focus, and then we focus our element right
    // after, seems fine.
    setTimeout(() => {
      if (modalElement.contains(document.activeElement)) {
        return;
      }
      const el = (findTabbable(modalElement)[0] || modalElement);
      el.focus();
    }, 0);
  }
}

export function markForFocusLater () {
  focusLaterElement = document.activeElement;
}

export function returnFocus () {
  try {
    focusLaterElement.focus();
  } catch (e) {
    console.warn(`You tried to return focus to ${focusLaterElement} but it is not in the DOM anymore`);
  }
  focusLaterElement = null;
}

export function setupScopedFocus (element) {
  modalElement = element;

  if (window.addEventListener) {
    window.addEventListener('blur', handleBlur, false);
    document.addEventListener('focus', handleFocus, true);
  } else {
    window.attachEvent('onBlur', handleBlur);
    document.attachEvent('onFocus', handleFocus);
  }
}

export function teardownScopedFocus () {
  modalElement = null;

  if (window.addEventListener) {
    window.removeEventListener('blur', handleBlur);
    document.removeEventListener('focus', handleFocus);
  } else {
    window.detachEvent('onBlur', handleBlur);
    document.detachEvent('onFocus', handleFocus);
  }
}
