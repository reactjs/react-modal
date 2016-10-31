//adapted from babel transpiler assign polyfill
var babelAssign = function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};

var _extends = Object.assign || babelAssign;

module.exports = _extends;
