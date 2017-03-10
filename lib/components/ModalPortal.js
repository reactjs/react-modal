import React, { Component, PropTypes } from 'react';
import Assign from 'lodash.assign';
import scopeTab from '../helpers/scopeTab';
import {
  returnFocus,
  setupScopedFocus,
  teardownScopedFocus,
  markForFocusLater
} from '../helpers/focusManager';


// so that our CSS is statically analyzable
const CLASS_NAMES = {
  overlay: {
    base: 'ReactModal__Overlay',
    afterOpen: 'ReactModal__Overlay--after-open',
    beforeClose: 'ReactModal__Overlay--before-close'
  },
  content: {
    base: 'ReactModal__Content',
    afterOpen: 'ReactModal__Content--after-open',
    beforeClose: 'ReactModal__Content--before-close'
  }
};

export default class ModalPortal extends Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onAfterOpen: PropTypes.func,
    closeTimeoutMS: PropTypes.number,
    shouldCloseOnOverlayClick: PropTypes.bool,
    onRequestClose: PropTypes.func,
    onAfterClose: React.PropTypes.func,
    className: PropTypes.string,
    overlayClassName: PropTypes.string,
    defaultStyles: PropTypes.shape({
      content: PropTypes.object,
      overlay: PropTypes.object
    }),
    style: PropTypes.shape({
      content: PropTypes.object,
      overlay: PropTypes.object
    }),
    role: PropTypes.string,
    children: PropTypes.node,
    contentLabel: PropTypes.string
  };

  static defaultProps = {
    style: {
      overlay: {},
      content: {}
    }
  };

  constructor () {
    super();
    this.state = {
      afterOpen: false,
      beforeClose: false
    };
    this.shouldClose = null;
  }

  componentDidMount () {
    // Focus needs to be set when mounting and already open
    if (this.props.isOpen) {
      this.setFocusAfterRender(true);
      this.open();
    }
  }

  componentWillReceiveProps (newProps) {
    // Focus only needs to be set once when the modal is being opened
    if (!this.props.isOpen && newProps.isOpen) {
      this.setFocusAfterRender(true);
      this.open();
    } else if (this.props.isOpen && !newProps.isOpen) {
      this.close();
    }
  }

  componentDidUpdate () {
    if (this.focusAfterRender) {
      this.focusContent();
      this.setFocusAfterRender(false);
    }
  }

  componentWillUnmount () {
    clearTimeout(this.closeTimer);
  }

  setFocusAfterRender (focus) {
    this.focusAfterRender = focus;
  }

  afterClose = () => {
    returnFocus();
    teardownScopedFocus();
    if (this.props.onAfterClose) {
      this.props.onAfterClose();
    }
  }

  open () {
    if (this.state.afterOpen && this.state.beforeClose) {
      clearTimeout(this.closeTimer);
      this.setState({ beforeClose: false });
    } else {
      setupScopedFocus(this.node);
      markForFocusLater();
      this.setState({ isOpen: true }, () => {
        this.setState({ afterOpen: true });

        if (this.props.isOpen && this.props.onAfterOpen) {
          this.props.onAfterOpen();
        }
      });
    }
  }

  close () {
    if (this.props.closeTimeoutMS > 0) {
      this.closeWithTimeout();
    } else {
      this.closeWithoutTimeout();
    }
  }

  focusContent () {
    // Don't steal focus from inner elements
    if (!this.contentHasFocus()) {
      this.content.focus();
    }
  }

  closeWithTimeout () {
    const closesAt = Date.now() + this.props.closeTimeoutMS;
    this.setState({ beforeClose: true, closesAt }, () => {
      this.closeTimer = setTimeout(this.closeWithoutTimeout, this.state.closesAt - Date.now());
    });
  }

  closeWithoutTimeout = () => {
    this.setState({
      beforeClose: false,
      isOpen: false,
      afterOpen: false,
      closesAt: null
    }, this.afterClose);
  }

  handleKeyDown = (event) => {
    if (event.keyCode === 9 /* tab*/) scopeTab(this.content, event);
    if (event.keyCode === 27 /* esc*/) {
      event.preventDefault();
      this.requestClose(event);
    }
  }

  handleOverlayOnClick = (event) => {
    if (this.shouldClose === null) {
      this.shouldClose = true;
    }
    if (this.shouldClose && this.props.shouldCloseOnOverlayClick) {
      if (this.ownerHandlesClose()) {
        this.requestClose(event);
      } else {
        this.focusContent();
      }
    }
    this.shouldClose = null;
  }

  handleContentOnClick = () => {
    this.shouldClose = false;
  }

  requestClose (event) {
    if (this.ownerHandlesClose()) {
      this.props.onRequestClose(event);
    }
  }

  ownerHandlesClose () {
    return this.props.onRequestClose;
  }

  shouldBeClosed () {
    return !this.state.isOpen && !this.state.beforeClose;
  }

  contentHasFocus () {
    return document.activeElement === this.content || this.content.contains(document.activeElement);
  }

  buildClassName (which, additional) {
    let className = CLASS_NAMES[which].base;
    if (this.state.afterOpen) { className += ` ${CLASS_NAMES[which].afterOpen}`; }
    if (this.state.beforeClose) {
      className += ` ${CLASS_NAMES[which].beforeClose}`;
    }
    return additional ? `${className} ${additional}` : className;
  }

  render () {
    const contentStyles = (this.props.className) ? {} : this.props.defaultStyles.content;
    const overlayStyles = (this.props.overlayClassName) ? {} : this.props.defaultStyles.overlay;

    // Disabling this rule is okay, since we know what is going on here, that being said
    // longterm we should probably do this better.
    /* eslint-disable jsx-a11y/no-static-element-interactions */
    return this.shouldBeClosed() ? <div /> : (
      <div
        ref={(c) => { this.overlay = c; }}
        className={this.buildClassName('overlay', this.props.overlayClassName)}
        style={Assign({}, overlayStyles, this.props.style.overlay || {})}
        onClick={this.handleOverlayOnClick}
      >
        <div
          ref={(c) => { this.content = c; }}
          style={Assign({}, contentStyles, this.props.style.content || {})}
          className={this.buildClassName('content', this.props.className)}
          tabIndex={-1}
          onKeyDown={this.handleKeyDown}
          onClick={this.handleContentOnClick}
          role={this.props.role}
          aria-label={this.props.contentLabel}
        >
          {this.props.children}
        </div>
      </div>
    );
    /* eslint-enable jsx-a11y/no-static-element-interactions */
  }
}
