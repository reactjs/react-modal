import React, { Component } from 'react';
import * as focusManager from '../helpers/focusManager';
import { scopeTab } from '../helpers/scopeTab';

// so that our CSS is statically analyzable
const CLASS_NAMES = {
  overlay: 'ReactModal__Overlay',
  content: 'ReactModal__Content'
};

const TAB_KEY = 9;
const ESC_KEY = 27;

export default class ModalPortal extends Component {
  static defaultProps = {
    style: {
      overlay: {},
      content: {}
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      afterOpen: false,
      beforeClose: false
    };

    this.shouldClose = null;
  }

  componentDidMount() {
    // Focus needs to be set when mounting and already open
    if (this.props.isOpen) {
      this.setFocusAfterRender(true);
      this.open();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.closeTimer);
  }

  componentWillReceiveProps(newProps) {
    // Focus only needs to be set once when the modal is being opened
    if (!this.props.isOpen && newProps.isOpen) {
      this.setFocusAfterRender(true);
      this.open();
    } else if (this.props.isOpen && !newProps.isOpen) {
      this.close();
    }
  }

  componentDidUpdate() {
    if (this.focusAfterRender) {
      this.focusContent();
      this.setFocusAfterRender(false);
    }
  }

  setFocusAfterRender = focus => {
    this.focusAfterRender = focus;
  }

  afterClose = () => {
    focusManager.returnFocus();
    focusManager.teardownScopedFocus();
  }

  open = () => {
    if (this.state.afterOpen && this.state.beforeClose) {
      clearTimeout(this.closeTimer);
      this.setState({ beforeClose: false });
    } else {
      focusManager.setupScopedFocus(this.node);
      focusManager.markForFocusLater();
      this.setState({ isOpen: true }, () => {
        this.setState({ afterOpen: true });

        if (this.props.isOpen && this.props.onAfterOpen) {
          this.props.onAfterOpen();
        }
      });
    }
  }

  close = () => {
    if (this.props.closeTimeoutMS > 0) {
      this.closeWithTimeout();
    } else {
      this.closeWithoutTimeout();
    }
  }

  focusContent = () => {
    // Don't steal focus from inner elements
    if (!this.contentHasFocus()) {
      this.refs.content.focus();
    }
  }

  closeWithTimeout = () => {
    const closesAt = Date.now() + this.props.closeTimeoutMS;
    this.setState({ beforeClose: true, closesAt: closesAt }, () => {
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

  handleKeyDown = event => {
    if (event.keyCode == TAB_KEY) {
      scopeTab(this.refs.content, event);
    }
    if (event.keyCode == ESC_KEY) {
      event.preventDefault();
      this.requestClose(event);
    }
  }

  handleOverlayOnClick = event => {
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

  requestClose = event => {
    if (this.ownerHandlesClose()) {
      this.props.onRequestClose(event);
    }
  }

  ownerHandlesClose = () => {
    return this.props.onRequestClose;
  }

  shouldBeClosed = () => {
    return !this.state.isOpen && !this.state.beforeClose;
  }

  contentHasFocus = () => {
    return document.activeElement === this.refs.content || this.refs.content.contains(document.activeElement);
  }

  buildClassName = (which, additional) => {
    const classNames = (typeof additional === 'object') ? additional : {
      base: CLASS_NAMES[which],
      afterOpen: CLASS_NAMES[which] + "--after-open",
      beforeClose: CLASS_NAMES[which] + "--before-close"
    };
    let className = classNames.base;
    if (this.state.afterOpen) { className += " " + classNames.afterOpen; }
    if (this.state.beforeClose) { className += " " + classNames.beforeClose; }
    return (typeof additional === 'string' && additional) ? [className, additional].join(" ") : className;
  }

  render() {
    const contentStyles = this.props.className ? {} : this.props.defaultStyles.content;
    const overlayStyles = this.props.overlayClassName ? {} : this.props.defaultStyles.overlay;

    return this.shouldBeClosed() ? <div /> : (
      <div ref="overlay"
           className={this.buildClassName('overlay', this.props.overlayClassName)}
           style={{ ...overlayStyles, ...this.props.style.overlay }}
           onClick={this.handleOverlayOnClick}>
        <div ref="content"
             style={{ ...contentStyles, ...this.props.style.content }}
             className={this.buildClassName('content', this.props.className)}
             tabIndex="-1"
             onKeyDown={this.handleKeyDown}
             onClick={this.handleContentOnClick}
             role={this.props.role}
             aria-label={this.props.contentLabel}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
