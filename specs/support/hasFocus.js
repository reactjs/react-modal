/*
 * Custom assertion for checking focus.
 * Adapted from https://gist.github.com/Rykus0/fa62d641dfeb75316d04
 */

 var util = require('util');

exports.assertion = function(selector, msg) {
    var ancestors = selector;

    // If the selector comes from a section of a page object
    // selector will be an array of objects starting from the outermost
    // ancestor (section), and ending with the element
    // Join their selectors in order
    // Should probably look into getting this added to core
    if( typeof ancestors !== 'string' ){
        selector = '';

        while( oElement = ancestors.shift() ){
            selector += ' ' + oElement.selector;
        }
    }

    this.message  = msg || util.format('Testing if element <%s> has focus', selector);
    this.expected = true;

    this.pass = function(value) {
        return value === this.expected;
    };

    this.value = function(result) {
        return result.value;
    };

    this.command = function(callback){
        this.api.execute(function(selector){
            return document.activeElement === document.querySelector(selector);
        }, [selector], callback);
    };

};
