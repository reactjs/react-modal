/*!
 * Adapted from jQuery UI core
 *
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */

 function hidden (el) {
   return (el.offsetWidth <= 0 && el.offsetHeight <= 0) ||
     el.style.display === 'none';
 }

 function visible (element) {
   let ourElement = element;
   while (ourElement) {
     if (ourElement === document.body) break;
     if (hidden(ourElement)) return false;
     ourElement = ourElement.parentNode;
   }
   return true;
 }

 function focusable (element, isTabIndexNotNaN) {
   const nodeName = element.nodeName.toLowerCase();
   const isFocusableLink = nodeName === 'a' ?
    element.href || isTabIndexNotNaN : isTabIndexNotNaN;
   return (/input|select|textarea|button|object/.test(nodeName) ?
    !element.disabled : isFocusableLink
    ) && visible(element);
 }


 function tabbable (element) {
   let tabIndex = element.getAttribute('tabindex');
   if (tabIndex === null) tabIndex = undefined;
   const isTabIndexNaN = isNaN(tabIndex);
   return (isTabIndexNaN || tabIndex >= 0) && focusable(element, !isTabIndexNaN);
 }

 function findTabbableDescendants (element) {
   return [].slice.call(element.querySelectorAll('*'), 0).filter(el => tabbable(el));
 }

 export default findTabbableDescendants;
