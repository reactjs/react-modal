import React, { Component } from "react";
import PropTypes from "prop-types";
import * as focusManager from "../helpers/focusManager";
import scopeTab from "../helpers/scopeTab";
import * as ariaAppHider from "../helpers/ariaAppHider";
import * as classList from "../helpers/classList";
import SafeHTMLElement from "../helpers/safeHTMLElement";
import {
  CLOSED,
  OPENING,
  OPEN,
  CLOSING,
  buildClassName,
  attributesFromObject
} from "../helpers/support";

const TAB_KEY = 9;
const ESC_KEY = 27;

let ariaHiddenInstances = 0;

export default class ModalPortal extends Component {
  static defaultProps = {
    style: {
      overlay: {},
      content: {}
    },
    defaultStyles: {}
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
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    overlayClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    bodyOpenClassName: PropTypes.string,
    htmlOpenClassName: PropTypes.string,
    ariaHideApp: PropTypes.bool,
    appElement: PropTypes.instanceOf(SafeHTMLElement),
    onAfterOpen: PropTypes.func,
    onAfterClose: PropTypes.func,
    onRequestClose: PropTypes.func,
    closeTimeoutMS: PropTypes.number,
    shouldFocusAfterRender: PropTypes.bool,
    shouldCloseOnOverlayClick: PropTypes.bool,
    shouldReturnFocusAfterClose: PropTypes.bool,
    role: PropTypes.string,
    contentLabel: PropTypes.string,
    aria: PropTypes.object,
    data: PropTypes.object,
    children: PropTypes.node,
    shouldCloseOnEsc: PropTypes.bool,
    overlayRef: PropTypes.func,
    contentRef: PropTypes.func,
    testId: PropTypes.string
  };

  state = { state: CLOSED };

  shouldClose = null;
  moveFromContentToOverlay = null;

  componentDidMount() {
    this.props.isOpen && this.open();
  }

  componentDidUpdate(prevProps, prevState) {
    if (process.env.NODE_ENV !== "production") {
      if (prevProps.bodyOpenClassName !== this.props.bodyOpenClassName) {
        // eslint-disable-next-line no-console
        console.warn(
          'React-Modal: "bodyOpenClassName" prop has been modified. ' +
            "This may cause unexpected behavior when multiple modals are open."
        );
      }
      if (prevProps.htmlOpenClassName !== this.props.htmlOpenClassName) {
        // eslint-disable-next-line no-console
        console.warn(
          'React-Modal: "htmlOpenClassName" prop has been modified. ' +
            "This may cause unexpected behavior when multiple modals are open."
        );
      }
    }

    if (this.props.isOpen && !prevProps.isOpen) {
      this.open();
    } else if (!this.props.isOpen && prevProps.isOpen) {
      this.close();
    }

    // Focus only needs to be set once when the modal is being opened
    this.props.shouldFocusAfterRender &&
      this.state.isOpen &&
      !prevState.isOpen &&
      this.focusContent();
  }

  componentWillUnmount() {
    this.afterClose();
    clearTimeout(this.closeTimer);
  }

  setOverlayRef = overlay => {
    this.overlay = overlay;
    this.props.overlayRef && this.props.overlayRef(overlay);
  };

  setContentRef = content => {
    this.content = content;
    this.props.contentRef && this.props.contentRef(content);
  };

  beforeOpen() {
    const {
      appElement,
      ariaHideApp,
      htmlOpenClassName,
      bodyOpenClassName
    } = this.props;

    // Add classes.
    bodyOpenClassName && classList.add(document.body, bodyOpenClassName);

    htmlOpenClassName &&
      classList.add(
        document.getElementsByTagName("html")[0],
        htmlOpenClassName
      );

    if (ariaHideApp) {
      ariaHiddenInstances += 1;
      ariaAppHider.hide(appElement);
    }
  }

  afterClose = () => {
    const {
      appElement,
      ariaHideApp,
      htmlOpenClassName,
      bodyOpenClassName,
      shouldFocusAfterRender,
      shouldReturnFocusAfterClose,
      onAfterClose
    } = this.props;

    // Remove classes.
    bodyOpenClassName && classList.remove(document.body, bodyOpenClassName);

    htmlOpenClassName &&
      classList.remove(
        document.getElementsByTagName("html")[0],
        htmlOpenClassName
      );

    // Reset aria-hidden attribute if all modals have been removed
    if (ariaHideApp && ariaHiddenInstances > 0) {
      ariaHiddenInstances -= 1;

      if (ariaHiddenInstances === 0) {
        ariaAppHider.show(appElement);
      }
    }

    if (shouldFocusAfterRender) {
      if (shouldReturnFocusAfterClose) {
        focusManager.returnFocus();
        focusManager.teardownScopedFocus();
      } else {
        focusManager.popWithoutFocus();
      }
    }

    onAfterClose && onAfterClose();
  };

  open = () => {
    this.beforeOpen();
    if (this.state.state == CLOSING) {
      clearTimeout(this.closeTimer);
      this.setState({ state: OPENING });
    } else {
      if (this.props.shouldFocusAfterRender) {
        focusManager.setupScopedFocus(this.node);
        focusManager.markForFocusLater();
      }

      this.setState({ isOpen: true }, () => {
        this.setState({ state: OPEN });

        if (this.props.isOpen && this.props.onAfterOpen) {
          this.props.onAfterOpen();
        }
      });
    }
  };

  close = () =>
    this.props.closeTimeoutMS > 0
      ? this.closeWithTimeout()
      : this.closeWithoutTimeout();

  // Don't steal focus from inner elements
  focusContent = () =>
    this.content && !this.contentHasFocus() && this.content.focus();

  closeWithTimeout = () => {
    const closesAt = Date.now() + this.props.closeTimeoutMS;
    this.setState({ state: CLOSING, closesAt }, () => {
      this.closeTimer = setTimeout(
        this.closeWithoutTimeout,
        this.state.closesAt - Date.now()
      );
    });
  };

  closeWithoutTimeout = () =>
    this.setState(
      {
        state: CLOSED,
        isOpen: false,
        closesAt: null
      },
      this.afterClose
    );

  handleKeyDown = event => {
    if (event.keyCode === TAB_KEY) {
      scopeTab(this.content, event);
    }

    if (this.props.shouldCloseOnEsc && event.keyCode === ESC_KEY) {
      event.stopPropagation();
      this.requestClose(event);
    }
  };

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
  };

  handleContentOnMouseUp = () => (this.shouldClose = false);

  handleOverlayOnMouseDown = event =>
    !this.props.shouldCloseOnOverlayClick &&
    event.target == this.overlay &&
    event.preventDefault();

  handleContentOnClick = () => (this.shouldClose = false);

  handleContentOnMouseDown = () => (this.shouldClose = false);

  requestClose = event =>
    this.ownerHandlesClose() && this.props.onRequestClose(event);

  ownerHandlesClose = () => this.props.onRequestClose;

  shouldBeClosed = () => !this.state.isOpen && !this.state.beforeClose;

  contentHasFocus = () =>
    document.activeElement === this.content ||
    this.content.contains(document.activeElement);

  render() {
    const { state } = this.state;
    const { className, overlayClassName, defaultStyles } = this.props;
    const contentStyles = className ? {} : defaultStyles.content;
    const overlayStyles = overlayClassName ? {} : defaultStyles.overlay;

    return this.shouldBeClosed() ? null : (
      <div
        ref={this.setOverlayRef}
        className={buildClassName(state, "overlay", overlayClassName)}
        style={{ ...overlayStyles, ...this.props.style.overlay }}
        onClick={this.handleOverlayOnClick}
        onMouseDown={this.handleOverlayOnMouseDown}
      >
        <div
          ref={this.setContentRef}
          style={{ ...contentStyles, ...this.props.style.content }}
          className={buildClassName(state, "content", className)}
          tabIndex="-1"
          onKeyDown={this.handleKeyDown}
          onMouseDown={this.handleContentOnMouseDown}
          onMouseUp={this.handleContentOnMouseUp}
          onClick={this.handleContentOnClick}
          role={this.props.role}
          aria-label={this.props.contentLabel}
          {...attributesFromObject("aria", this.props.aria || {})}
          {...attributesFromObject("data", this.props.data || {})}
          data-testid={this.props.testId}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}
