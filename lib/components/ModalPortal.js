var React = require('react');
var div = React.DOM.div;
var focusManager = require('../helpers/focusManager');
var scopeTab = require('../helpers/scopeTab');

// so that our CSS is statically analyzable
var CLASS_NAMES = {
  overlay: {
    base: 'ReactModal__Overlay',
    afterOpen: 'ReactModal__Overlay--after-open',
    beforeClose: 'ReactModal__Overlay--before-close',
  },
  content: {
    base: 'ReactModal__Content',
    afterOpen: 'ReactModal__Content--after-open',
    beforeClose: 'ReactModal__Content--before-close',
  }
};

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

  handleKeyDown: function(event) {
    if (event.key == 9 /*tab*/) scopeTab(this.getDOMNode(), event);
    if (event.key == 27 /*esc*/) this.requestClose();
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

  overlayStyles: { position: 'fixed', left: 0, right: 0, top: 0, bottom: 0 },

  buildClassName: function(which) {
    var className = CLASS_NAMES[which].base;
    if (this.state.afterOpen)
      className += ' '+CLASS_NAMES[which].afterOpen;
    if (this.state.beforeClose)
      className += ' '+CLASS_NAMES[which].beforeClose;
    return className;
  },

  render: function() {
    return this.shouldBeClosed() ? div() : (
      div({
        className: this.buildClassName('overlay'),
        style: this.overlayStyles,
        onClick: this.handleOverlayClick
      },
        div({
          ref: "content",
          className: this.buildClassName('content'),
          tabIndex: "-1",
          onClick: stopPropagation,
          onKeyDown: this.handleKeyDown
        },
          this.props.children
        )
      )
    );
  }
});

