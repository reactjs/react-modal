/** @jsx React.DOM */

var React = require('react');
var focusManager = require('../helpers/focusManager');
var scopeTab = require('../helpers/scopeTab');

function stopPropagation(event) {
  event.stopPropagation();
}

var ModalPortal = module.exports = React.createClass({

  displayName: 'ModalPortal',

  getInitialState: function() {
    return {
      afterOpen: false,
      beforeClose: false
    };
  },

  componentDidMount: function() {
    this.handleProps(this.props);
    this.maybeFocus();
  },

  componentWillReceiveProps: function(newProps) {
    this.handleProps(newProps);
  },

  handleProps: function(props) {
    if (props.isOpen === true)
      this.open();
    else if (props.isOpen === false)
      this.close();
  },

  open: function() {
    focusManager.setupScopedFocus(this.getDOMNode());
    focusManager.markForFocusLater();
    this.setState({isOpen: true}, function() {
      this.setState({afterOpen: true});
    }.bind(this));
  },

  close: function() {
    if (!this.ownerHandlesClose())
      return;
    if (this.props.closeTimeoutMS > 0)
      this.closeWithTimeout();
    else
      this.closeWithoutTimeout();
  },

  componentDidUpdate: function() {
    this.maybeFocus();
  },

  maybeFocus: function() {
    if (this.props.isOpen)
      this.focusContent();
  },

  focusContent: function() {
    this.refs.content.getDOMNode().focus();
  },

  closeWithTimeout: function() {
    this.setState({beforeClose: true}, function() {
      setTimeout(this.closeWithoutTimeout, this.props.closeTimeoutMS);
    }.bind(this));
  },

  closeWithoutTimeout: function() {
    this.setState({
      afterOpen: false,
      beforeClose: false
    }, this.afterClose);
  },

  afterClose: function() {
    focusManager.returnFocus();
    focusManager.teardownScopedFocus();
  },

  keepTabNavInside: function(event) {
    var node = this.getDOMNode();
    scopeTab(node, event);
  },

  handleKeyDown: function(event) {
    if (event.keyCode == 9 /*tab*/) this.keepTabNavInside(event);
    if (event.keyCode == 27 /*esc*/) this.requestClose();
  },

  handleOverlayClick: function() {
    if (this.ownerHandlesClose())
      this.requestClose();
    else
      this.focusContent();
  },

  requestClose: function() {
    if (this.ownerHandlesClose)
      this.props.onRequestClose();
  },

  ownerHandlesClose: function() {
    return this.props.onRequestClose;
  },

  shouldBeClosed: function() {
    return !this.props.isOpen && !this.state.beforeClose;
  },

  render: function() {
    if (this.shouldBeClosed()) {
      return <div/>;
    }
    else {
      var style = {position: 'fixed', left: 0, right: 0, top: 0, bottom: 0};
      var overlayClassName = 'ReactModal__Overlay';
      var contentClassName = 'ReactModal__Content';
      if (this.state.afterOpen) {
        overlayClassName += ' ReactModal__Overlay--after-open';
        contentClassName += ' ReactModal__Content--after-open';
      }
      if (this.state.beforeClose) {
        overlayClassName += ' ReactModal__Overlay--before-close';
        contentClassName += ' ReactModal__Content--before-close';
      }
      return (
        <div
          className={overlayClassName}
          style={style}
          onClick={this.handleOverlayClick}
        >
          <div
            onClick={stopPropagation}
            ref="content"
            onKeyDown={this.handleKeyDown}
            className={contentClassName}
            tabIndex="-1"
          >
            {this.props.children}
          </div>
        </div>
      );
    }
  }

});

