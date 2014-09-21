var findTabbable = require('../helpers/tabbable');
var modalElement = null;
var focusLaterElement = null;
var needToFocus = false;

function handleBlur(event) {
  needToFocus = true;
}

function handleFocus(event) {
  if (needToFocus) {
    needToFocus = false;
    // need to see how jQuery shims document.on('focusin') so we don't need the
    // setTimeout, firefox doesn't support focusin
    setTimeout(function() {
      if (modalElement.contains(document.activeElement))
        return;
      var el = (findTabbable(modalElement)[0] || modalElement);
      el.focus();
    }, 0);
  }
}

exports.markForFocusLater = function() {
  focusLaterElement = document.activeElement;
};

exports.returnFocus = function() {
  focusLaterElement.focus();
  focusLaterElement = null;
};

exports.setupScopedFocus = function(element) {
  modalElement = element;
  window.addEventListener('blur', handleBlur, false);
  document.addEventListener('focus', handleFocus, true);
};

exports.teardownScopedFocus = function() {
  modalElement = null;
  window.removeEventListener('blur', handleBlur);
  document.removeEventListener('focus', handleFocus);
};

