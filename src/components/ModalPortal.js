import React, { Component } from "react";
import PropTypes from "prop-types";
import * as focusManager from "../helpers/focusManager";
import scopeTab from "../helpers/scopeTab";
import * as ariaAppHider from "../helpers/ariaAppHider";
import * as classList from "../helpers/classList";
import SafeHTMLElement from "../helpers/safeHTMLElement";

// so that our CSS is statically analyzable
const CLASS_NAMES = {
  overlay: "ReactModal__Overlay",
  content: "ReactModal__Content"
};

const WILL_OPEN = 0;
const OPENED = 1;
const WILL_CLOSE = 2;
const CLOSED = 3;

const TAB_KEY = 9;
const ESC_KEY = 27;

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

  constructor(props) {
    super(props);
    this.state.state = props.isOpen ? WILL_OPEN : CLOSED;
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

    // Focus only needs to be set once when the modal is being opened
    if (
      this.props.shouldFocusAfterRender &&
      this.state.isOpen &&
      !prevState.isOpen
    ) {
      this.focusContent();
    }
  }

  componentWillUnmount() {
  }

  setOverlayRef = overlay => {
    this.overlay = overlay;
    this.props.overlayRef && this.props.overlayRef(overlay);
  };

  setContentRef = content => {
    this.content = content;
    this.props.contentRef && this.props.contentRef(content);
  };

  // Don't steal focus from inner elements
  focusContent = () =>
    this.content && !this.contentHasFocus() && this.content.focus();

  handleKeyDown = event => {
    if (event.keyCode === TAB_KEY) {
      scopeTab(this.content, event);
    }

    if (this.props.shouldCloseOnEsc && event.keyCode === ESC_KEY) {
      event.stopPropagation();
      this.props.onRequestClose(event);
    }
  };

  handleOverlayOnClick = event => {
    if (this.shouldClose === null) {
      this.shouldClose = true;
    }

    if (this.shouldClose && this.props.shouldCloseOnOverlayClick) {
      if (this.props.onRequestClose) {
        this.props.onRequestClose(event);
      } else {
        this.focusContent();
      }
    }
    this.shouldClose = null;
  };

  handleContentOnMouseUp = () => (this.shouldClose = false);

  handleOverlayOnMouseDown = event =>
    (!this.props.shouldCloseOnOverlayClick &&
     event.target == this.overlay
    ) && event.preventDefault();

  handleContentOnClick = () => (this.shouldClose = false);

  handleContentOnMouseDown = () => (this.shouldClose = false);

  contentHasFocus = () =>
    document.activeElement === this.content ||
    this.content.contains(document.activeElement);

  buildClassName = (which, additional) => {
    const classNames =
      typeof additional === "object"
        ? additional
        : {
            base: CLASS_NAMES[which],
            afterOpen: `${CLASS_NAMES[which]}--after-open`,
            beforeClose: `${CLASS_NAMES[which]}--before-close`
          };
    let className = classNames.base;
    if (this.props.shouldRender < WILL_CLOSE) {
      className = `${className} ${classNames.afterOpen}`;
    }
    if (this.props.shouldRender >= WILL_CLOSE) {
      className = `${className} ${classNames.beforeClose}`;
    }
    return typeof additional === "string" && additional
      ? `${className} ${additional}`
      : className;
  };

  attributesFromObject = (prefix, items) =>
    Object.keys(items).reduce((acc, name) => {
      acc[`${prefix}-${name}`] = items[name];
      return acc;
    }, {});

  render() {
    const { className, overlayClassName, defaultStyles } = this.props;
    const contentStyles = className ? {} : defaultStyles.content;
    const overlayStyles = overlayClassName ? {} : defaultStyles.overlay;

    return (
      <div
        ref={this.setOverlayRef}
        className={this.buildClassName("overlay", overlayClassName)}
        style={{ ...overlayStyles, ...this.props.style.overlay }}
        onClick={this.handleOverlayOnClick}
        onMouseDown={this.handleOverlayOnMouseDown}
      >
        <div
          ref={this.setContentRef}
          style={{ ...contentStyles, ...this.props.style.content }}
          className={this.buildClassName("content", className)}
          tabIndex="-1"
          onKeyDown={this.handleKeyDown}
          onMouseDown={this.handleContentOnMouseDown}
          onMouseUp={this.handleContentOnMouseUp}
          onClick={this.handleContentOnClick}
          role={this.props.role}
          aria-label={this.props.contentLabel}
          {...this.attributesFromObject("aria", this.props.aria || {})}
          {...this.attributesFromObject("data", this.props.data || {})}
          data-testid={this.props.testId}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}
