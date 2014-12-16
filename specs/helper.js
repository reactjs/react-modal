assert = require('assert');
React = require('react/addons');
var Modal = React.createFactory(require('../lib/components/Modal'));

ReactTestUtils = React.addons.TestUtils;
ok = assert.ok;
equal = assert.equal;
strictEqual = assert.strictEqual;
throws = assert.throws;

var _currentDiv = null;

renderModal = function(props, children, callback) {
  props.ariaHideApp = false;
  _currentDiv = document.createElement('div');
  document.body.appendChild(_currentDiv);
  return React.render(Modal(props, children), _currentDiv, callback);
};

unmountModal = function() {
  React.unmountComponentAtNode(_currentDiv);
  document.body.removeChild(_currentDiv);
  _currentDiv = null;
};
