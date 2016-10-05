var React = require('react');
var div = React.DOM.div;
var focusManager = require('../helpers/focusManager');
var scopeTab = require('../helpers/scopeTab');

var noOp = function(){};

var defaultProps = {
  onAfterClose: noOp,
  style: {
    overlay: {},
    content: {}
  },
  overlayClassName: 'ReactModal__Overlay',
  className: 'ReactModal__Content'
};

var ModalPortal = module.exports = React.createClass({
  displayName: 'ModalPortal',
  shouldClose: null,

  getDefaultProps: function() {
    return defaultProps;
  },

  getInitialState: function() {
    return {
      afterOpen: false,
      beforeClose: false
    };
  },

  componentDidMount: function() {
    // Focus needs to be set when mounting and already open
    if (this.props.isOpen) {
      this.setFocusAfterRender(true);
      this.open();
    }
  },

  componentWillUnmount: function() {
    clearTimeout(this.closeTimer);
  },

  componentWillReceiveProps: function(newProps) {
    // Focus only needs to be set once when the modal is being opened
    if (!this.props.isOpen && newProps.isOpen) {
      this.setFocusAfterRender(true);
      this.open();
    } else if (this.props.isOpen && !newProps.isOpen) {
      this.close();
    }
  },

  componentDidUpdate: function () {
    if (this.focusAfterRender) {
      this.focusContent();
      this.setFocusAfterRender(false);
    }
  },

  setFocusAfterRender: function (focus) {
    this.focusAfterRender = focus;
  },

  open: function() {
    if (this.state.afterOpen && this.state.beforeClose) {
      clearTimeout(this.closeTimer);
      this.setState({ beforeClose: false });
    } else {
      focusManager.setupScopedFocus(this.node);
      focusManager.markForFocusLater();
      this.setState({isOpen: true}, function() {
        this.setState({afterOpen: true});

        if (this.props.isOpen && this.props.onAfterOpen) {
          this.props.onAfterOpen();
        }
      }.bind(this));
    }
  },

  close: function() {
    if (!this.ownerHandlesClose())
      return;
    if (this.props.closeTimeoutMS > 0)
      this.closeWithTimeout();
    else
      this.closeWithoutTimeout();
  },

  focusContent: function() {
    // Don't steal focus from inner elements
    if (!this.contentHasFocus()) {
      this.refs.content.focus();
    }
  },

  closeWithTimeout: function() {
    this.setState({beforeClose: true}, function() {
      this.closeTimer = setTimeout(this.closeWithoutTimeout, this.props.closeTimeoutMS);
    }.bind(this));
  },

  closeWithoutTimeout: function() {
    this.setState({
      beforeClose: false,
      isOpen: false,
      afterOpen: false,
    }, this.afterClose);
  },

  afterClose: function() {
    focusManager.returnFocus();
    focusManager.teardownScopedFocus();
    this.props.onAfterClose();
  },

  handleKeyDown: function(event) {
    if (event.keyCode == 9 /*tab*/) scopeTab(this.refs.content, event);
    if (event.keyCode == 27 /*esc*/) {
      event.preventDefault();
      this.requestClose(event);
    }
  },

  handleOverlayMouseDown: function(event) {
    if (this.shouldClose === null) {
      this.shouldClose = true;
    }
  },

  handleOverlayMouseUp: function(event) {
    if (this.shouldClose && this.props.shouldCloseOnOverlayClick) {
      if (this.ownerHandlesClose())
        this.requestClose(event);
      else
        this.focusContent();
    }
    this.shouldClose = null;
  },

  handleContentMouseDown: function(event) {
    this.shouldClose = false;
  },

  handleContentMouseUp: function(event) {
    this.shouldClose = false;
  },

  requestClose: function(event) {
    if (this.ownerHandlesClose())
      this.props.onRequestClose(event);
  },

  ownerHandlesClose: function() {
    return this.props.onRequestClose;
  },

  shouldBeClosed: function() {
    return !this.props.isOpen && !this.state.beforeClose;
  },

  contentHasFocus: function() {
    return document.activeElement === this.refs.content || this.refs.content.contains(document.activeElement);
  },

  buildClassName: function(baseClass) {
    var className = baseClass+" ";
    if (this.state.afterOpen)
      className += baseClass+'--after-open';
    if (this.state.beforeClose)
      className += baseClass+'--before-close';
    return className;
  },

  getPropInlineStyle: function(useDefaultStyle, styleName) {
    var defaultStyles = useDefaultStyle ? this.props.defaultStyles[styleName] : {};
    var propsStyles = this.props.style[styleName] || {};
    return {...defaultStyles, ...propsStyles};
  },

  isPropEqualToDefault: function(propName) {
    return this.props[propName] === defaultProps[propName];
  },

  render: function() {
    var contentStyles = this.getPropInlineStyle(this.isPropEqualToDefault("className"), "content");
    var overlayStyles = this.getPropInlineStyle(this.isPropEqualToDefault("overlayClassName"), "overlay");

    return this.shouldBeClosed() ? div() : (
      div({
        ref: "overlay",
        className: this.buildClassName(this.props.overlayClassName),
        style: overlayStyles,
        onMouseDown: this.handleOverlayMouseDown,
        onMouseUp: this.handleOverlayMouseUp
      },
        div({
          ref: "content",
          style: contentStyles,
          className: this.buildClassName(this.props.className),
          tabIndex: "-1",
          onKeyDown: this.handleKeyDown,
          onMouseDown: this.handleContentMouseDown,
          onMouseUp: this.handleContentMouseUp,
          role: "dialog"
        },
          this.props.children
        )
      )
    );
  }
});
