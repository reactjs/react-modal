import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import ModalPortal from "./ModalPortal";
import * as ariaAppHider from "../helpers/ariaAppHider";
import SafeHTMLElement, {
  SafeNodeList,
  SafeHTMLCollection,
  canUseDOM
} from "../helpers/safeHTMLElement";

import { polyfill } from "react-lifecycles-compat";

export const portalClassName = "ReactModalPortal";
export const bodyOpenClassName = "ReactModal__Body--open";

const isReact16 = canUseDOM && ReactDOM.createPortal !== undefined;

let createHTMLElement = name => document.createElement(name);

const getCreatePortal = () =>
  isReact16
    ? ReactDOM.createPortal
    : ReactDOM.unstable_renderSubtreeIntoContainer;

function getParentElement(parentSelector) {
  return parentSelector();
}

class Modal extends Component {
  static setAppElement(element) {
    ariaAppHider.setElement(element);
  }

  /* eslint-disable react/no-unused-prop-types */
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    style: PropTypes.shape({
      content: PropTypes.object,
      overlay: PropTypes.object
    }),
    portalClassName: PropTypes.string,
    bodyOpenClassName: PropTypes.string,
    htmlOpenClassName: PropTypes.string,
    className: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        base: PropTypes.string.isRequired,
        afterOpen: PropTypes.string.isRequired,
        beforeClose: PropTypes.string.isRequired
      })
    ]),
    overlayClassName: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        base: PropTypes.string.isRequired,
        afterOpen: PropTypes.string.isRequired,
        beforeClose: PropTypes.string.isRequired
      })
    ]),
    appElement: PropTypes.oneOfType([
      PropTypes.instanceOf(SafeHTMLElement),
      PropTypes.instanceOf(SafeHTMLCollection),
      PropTypes.instanceOf(SafeNodeList),
      PropTypes.arrayOf(PropTypes.instanceOf(SafeHTMLElement))
    ]),
    onAfterOpen: PropTypes.func,
    onRequestClose: PropTypes.func,
    closeTimeoutMS: PropTypes.number,
    ariaHideApp: PropTypes.bool,
    shouldFocusAfterRender: PropTypes.bool,
    shouldCloseOnOverlayClick: PropTypes.bool,
    shouldReturnFocusAfterClose: PropTypes.bool,
    preventScroll: PropTypes.bool,
    parentSelector: PropTypes.func,
    aria: PropTypes.object,
    data: PropTypes.object,
    role: PropTypes.string,
    contentLabel: PropTypes.string,
    shouldCloseOnEsc: PropTypes.bool,
    overlayRef: PropTypes.func,
    contentRef: PropTypes.func,
    id: PropTypes.string,
    overlayElement: PropTypes.func,
    contentElement: PropTypes.func
  };
  /* eslint-enable react/no-unused-prop-types */

  static defaultProps = {
    isOpen: false,
    portalClassName,
    bodyOpenClassName,
    role: "dialog",
    ariaHideApp: true,
    closeTimeoutMS: 0,
    shouldFocusAfterRender: true,
    shouldCloseOnEsc: true,
    shouldCloseOnOverlayClick: true,
    shouldReturnFocusAfterClose: true,
    preventScroll: false,
    parentSelector: () => document.body,
    overlayElement: (props, contentEl) => <div {...props}>{contentEl}</div>,
    contentElement: (props, children) => <div {...props}>{children}</div>
  };

  static defaultStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(255, 255, 255, 0.75)"
    },
    content: {
      position: "absolute",
      top: "40px",
      left: "40px",
      right: "40px",
      bottom: "40px",
      border: "1px solid #ccc",
      background: "#fff",
      overflow: "auto",
      WebkitOverflowScrolling: "touch",
      borderRadius: "4px",
      outline: "none",
      padding: "20px"
    }
  };

  componentDidMount() {
    if (!canUseDOM) return;

    clearTimeout(this.removePortalTimer);

    if (!isReact16) {
      this.node = createHTMLElement("div");
    }
    this.node.className = this.props.portalClassName;

    const parent = getParentElement(this.props.parentSelector);
    parent.appendChild(this.node);

    !isReact16 && this.renderPortal(this.props);
  }

  getSnapshotBeforeUpdate(prevProps) {
    const prevParent = getParentElement(prevProps.parentSelector);
    const nextParent = getParentElement(this.props.parentSelector);
    return { prevParent, nextParent };
  }

  componentDidUpdate(prevProps, _, snapshot) {
    if (!canUseDOM) return;
    const { isOpen, portalClassName } = this.props;

    if (prevProps.portalClassName !== portalClassName) {
      this.node.className = portalClassName;
    }

    const { prevParent, nextParent } = snapshot;
    if (nextParent !== prevParent) {
      prevParent.removeChild(this.node);
      nextParent.appendChild(this.node);
    }

    // Stop unnecessary renders if modal is remaining closed
    if (!prevProps.isOpen && !isOpen) return;

    !isReact16 && this.renderPortal(this.props);
  }

  componentWillUnmount() {
    if (!canUseDOM || !this.node || !this.portal) return;

    const state = this.portal.state;
    const now = Date.now();
    const closesAt =
      state.isOpen &&
      this.props.closeTimeoutMS &&
      (state.closesAt || now + this.props.closeTimeoutMS);

    if (closesAt) {
      if (!state.beforeClose) {
        this.portal.closeWithTimeout();
      }

      this.removePortalTimer = setTimeout(this.removePortal, closesAt - now);
    } else {
      this.removePortal();
    }
  }

  removePortal = () => {
    !isReact16 && ReactDOM.unmountComponentAtNode(this.node);
    const parent = getParentElement(this.props.parentSelector);
    if (parent && parent.contains(this.node)) {
      parent.removeChild(this.node);
    } else {
      // eslint-disable-next-line no-console
      console.warn(
        'React-Modal: "parentSelector" prop did not returned any DOM ' +
          "element. Make sure that the parent element is unmounted to " +
          "avoid any memory leaks."
      );
    }
  };

  portalRef = ref => {
    this.portal = ref;
  };

  renderPortal = props => {
    const createPortal = getCreatePortal();
    const portal = createPortal(
      this,
      <ModalPortal defaultStyles={Modal.defaultStyles} {...props} />,
      this.node
    );
    this.portalRef(portal);
  };

  render() {
    if (!canUseDOM || !isReact16) {
      return null;
    }

    if (!this.node && isReact16) {
      this.node = createHTMLElement("div");
    }

    const createPortal = getCreatePortal();
    return createPortal(
      <ModalPortal
        ref={this.portalRef}
        defaultStyles={Modal.defaultStyles}
        {...this.props}
      />,
      this.node
    );
  }
}

polyfill(Modal);

if (process.env.NODE_ENV !== "production") {
  Modal.setCreateHTMLElement = fn => (createHTMLElement = fn);
}

export default Modal;
