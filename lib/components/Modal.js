/** @jsx React.DOM */
var React = require('react');
var ariaAppHider = require('../helpers/ariaAppHider');
var findTabbable = require('../helpers/tabbable');

var ModalPortal = React.createClass({

  displayName: 'ModalPortal',

  componentDidMount: function() {
    this.maybeFocus();
  },

  componentDidUpdate: function() {
    this.maybeFocus();
  },

  maybeFocus: function() {
    if (this.props.isOpen)
      this.getDOMNode().focus();
  },

  focus: function() {
    var node = this.getDOMNode();
    if (node.contains(document.activeElement)) {
      return;
    }
    var tabbable = findTabbable(node);
    var target = tabbableElements.length ? tabbableElements[0] : node;
    target.focus();
  },

  keepTabNavInside: function(event) {
    var node = this.getDOMNode();
    var tabbable = findTabbable(node);
    var finalTabbable = tabbable[event.shiftKey ? 0 : tabbable.length - 1];
    var leavingFinalTabbable = (
      finalTabbable === document.activeElement ||
      // handle immediate shift+tab after opening with mouse
      node === document.activeElement
    );
    if (!leavingFinalTabbable) return;
    event.preventDefault();
    var target = tabbable[event.shiftKey ? tabbable.length - 1 : 0];
    target.focus();
  },

  handleKeyDown: function(event) {
    if (event.keyCode == 9 /*tab*/) this.keepTabNavInside(event);
    //if (event.keyCode == 27 [>esc<]) this.close();
  },

  render: function() {
    if (!this.props.isOpen) {
      return <div/>;
    }
    else {
      return (
        <div onKeyDown={this.handleKeyDown} className="ReactModal" tabIndex="-1">
          {this.props.children}
        </div>
      );
    }
  }

});

var Modal = module.exports = React.createClass({

  displayName: 'Modal',

  statics: {
    setAppElement: ariaAppHider.setElement
  },

  propTypes: {
    isOpen: React.PropTypes.bool.isRequired,
    appElement: React.PropTypes.instanceOf(HTMLElement)
  },

  getDefaultProps: function () {
    return {
      isOpen: false,
      ariaHideApp: true
    };
  },

  componentDidMount: function() {
    this.node = document.createElement('div');
    this.node.className = 'ReactModalPortal';
    document.body.appendChild(this.node);
    this.renderPortal(this.props);
  },

  componentWillReceiveProps: function(newProps) {
    this.renderPortal(newProps);
  },

  componentWillUnmount: function() {
    React.unmountComponentAtNode(this.node);
    document.body.removeChild(this.node);
  },

  renderPortal: function(props) {
    if (props.ariaHideApp) {
      ariaAppHider.toggle(props.isOpen, props.appElement);
    }
    React.renderComponent(ModalPortal(props), this.node);
  },

  render: function () {
    return null;
  }
});

