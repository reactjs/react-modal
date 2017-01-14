/*
 * Custom assertion for checking focus.
 * Adapted from https://gist.github.com/Rykus0/fa62d641dfeb75316d04
 */

 const util = require('util');

 exports.assertion = function assertion (selector, msg) {
   const ancestors = selector;
   let finalSelector = selector;

    // If the selector comes from a section of a page object
    // selector will be an array of objects starting from the outermost
    // ancestor (section), and ending with the element
    // Join their selectors in order
    // Should probably look into getting this added to core
   if (typeof ancestors !== 'string') {
     finalSelector = '';
     let oElement = ancestors.shift();
     while (oElement) {
       finalSelector += ` ${oElement.selector}`;
       oElement = ancestors.shift();
     }
   }

   this.message = msg || util.format('Testing if element <%s> has focus', selector);
   this.expected = true;

   this.pass = function pass (value) {
     return value === this.expected;
   };

   this.value = function value (result) {
     return result.value;
   };

   this.command = function command (callback) {
     this.api.execute(executeSelector => document.activeElement === document.querySelector(executeSelector), [finalSelector], callback);
   };
 };
