"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.canUseDOM = exports.SafeNodeList = exports.SafeHTMLCollection = exports.SafeHTMLElement = undefined;

var _exenv = require("exenv");

var _exenv2 = _interopRequireDefault(_exenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EE = _exenv2.default;

var NodeTypeElement = 1;

var IHTMLElement = function IHTMLElement(props, propName) {
  var element = props[propName];

  if (!element || element.nodeType !== NodeTypeElement) return;

  var isValid = Boolean(element.setAttribute && element.removeAttribute);

  if (!isValid) {
    return new Error("Warning: Invalid prop `" + propName + "` supplied to `Modal`");
  }
};

var SafeHTMLElement = exports.SafeHTMLElement = EE.canUseDOM ? IHTMLElement : {};

var SafeHTMLCollection = exports.SafeHTMLCollection = EE.canUseDOM ? window.HTMLCollection : {};

var SafeNodeList = exports.SafeNodeList = EE.canUseDOM ? window.NodeList : {};

var canUseDOM = exports.canUseDOM = EE.canUseDOM;

exports.default = SafeHTMLElement;