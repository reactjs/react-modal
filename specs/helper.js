assert = require('assert');
var React = require('react');
var ReactDOM = require('react-dom');
var Modal = React.createFactory(require('../lib/components/Modal'));

ok = assert.ok;
equal = assert.equal;
notEqual = assert.notEqual;
strictEqual = assert.strictEqual;
throws = assert.throws;

var _currentDiv = null;

renderModal = function(props, children, callback) {
  props.ariaHideApp = false;
  if (_currentDiv === null){
    _currentDiv = document.createElement('div');
    document.body.appendChild(_currentDiv);
  }
  return ReactDOM.render(Modal(props, children), _currentDiv, callback);
};

rerenderModal = function(_currentDiv, props, children, callback) {
  props.ariaHideApp = false;
  return ReactDOM.render(Modal(props, children), _currentDiv, callback);
};

unmountModal = function() {
  if (_currentDiv === null) return;
  ReactDOM.unmountComponentAtNode(_currentDiv);
  document.body.removeChild(_currentDiv);
  _currentDiv = null;
};
