import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import * as focusManager from '../helpers/focusManager';
import scopeTab from '../helpers/scopeTab';

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

  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    defaultStyles: PropTypes.shape({
      content: PropTypes.object,
      overlay: PropTypes.object
    }),
    style: PropTypes.shape({
      content: PropTypes.object,
      overlay: PropTypes.object
    }),
    className: PropTypes.oneOfType([
      PropTypes.String,
      PropTypes.object
    ]),
    overlayClassName: PropTypes.oneOfType([
      PropTypes.String,
      PropTypes.object
    ]),
    onAfterOpen: PropTypes.func,
    onRequestClose: PropTypes.func,
    closeTimeoutMS: PropTypes.number,
    shouldCloseOnOverlayClick: PropTypes.bool,
    role: PropTypes.string,
    contentLabel: PropTypes.string,
    children: PropTypes.node
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

  componentWillUnmount() {
    clearTimeout(this.closeTimer);
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

  // Don't steal focus from inner elements
  focusContent = () => (!this.contentHasFocus()) && this.content.focus();

  closeWithTimeout = () => {
    const closesAt = Date.now() + this.props.closeTimeoutMS;
    this.setState({ beforeClose: true, closesAt }, () => {
      this.closeTimer = setTimeout(
        this.closeWithoutTimeout,
        this.state.closesAt - Date.now()
      );
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
    if (event.keyCode === TAB_KEY) {
      scopeTab(this.content, event);
    }
    if (event.keyCode === ESC_KEY) {
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

  requestClose = event =>
    this.ownerHandlesClose() && this.props.onRequestClose(event);

  ownerHandlesClose = () =>
    this.props.onRequestClose;

  shouldBeClosed = () =>
    !this.state.isOpen && !this.state.beforeClose;

  contentHasFocus = () =>
    document.activeElement === this.content ||
    this.content.contains(document.activeElement);

  buildClassName = (which, additional) => {
    const classNames = (typeof additional === 'object') ? additional : {
      base: CLASS_NAMES[which],
      afterOpen: `${CLASS_NAMES[which]}--after-open`,
      beforeClose: `${CLASS_NAMES[which]}--before-close`
    };
    let className = classNames.base;
    if (this.state.afterOpen) {
      className = `${className} ${classNames.afterOpen}`;
    }
    if (this.state.beforeClose) {
      className = `${className} ${classNames.beforeClose}`;
    }
    return (typeof additional === 'string' && additional) ?
      `${className} ${additional}` : className;
  }

  render() {
    const { className, overlayClassName, defaultStyles } = this.props;
    const contentStyles = className ? {} : defaultStyles.content;
    const overlayStyles = overlayClassName ? {} : defaultStyles.overlay;

    return this.shouldBeClosed() ? <div /> : (
      <div
        ref={overlay => { this.overlay = overlay; }}
        className={this.buildClassName('overlay', overlayClassName)}
        style={{ ...overlayStyles, ...this.props.style.overlay }}
        onClick={this.handleOverlayOnClick}>
        <div
          ref={content => { this.content = content; }}
          style={{ ...contentStyles, ...this.props.style.content }}
          className={this.buildClassName('content', className)}
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
