/* global setTimeout, clearTimeout */
import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import ModalPortal from "./ModalPortal";
import * as ariaAppHider from "../helpers/ariaAppHider";
import * as classList from "../helpers/classList";
import SafeHTMLElement, { canUseDOM } from "../helpers/safeHTMLElement";

import { polyfill } from "react-lifecycles-compat";

export const portalClassName = "ReactModalPortal";
export const bodyOpenClassName = "ReactModal__Body--open";

const isReact16 = ReactDOM.createPortal !== undefined;

let ariaHiddenInstances = 0;

const getCreatePortal = () =>
  isReact16
    ? ReactDOM.createPortal
    : ReactDOM.unstable_renderSubtreeIntoContainer;

class EventTimer {
  timer = null;

  start = (duration, onTimeout) => (
    this.timer = setTimeout(
      () => {
        onTimeout();
        this.stop();
      },
      duration
    )
  );

  stop = () => clearTimeout(this.timer);

  reset = (duration, onTimeout) => {
    this.stop();
    this.state(duration, onTimeout);
  }
}

const WILL_OPEN = 0;
const OPENED = 1;
const WILL_CLOSE = 2;
const CLOSED = 3;

class Modal extends Component {
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
    appElement: PropTypes.instanceOf(SafeHTMLElement),
    onAfterOpen: PropTypes.func,
    onRequestClose: PropTypes.func,
    closeTimeoutMS: PropTypes.number,
    ariaHideApp: PropTypes.bool,
    shouldFocusAfterRender: PropTypes.bool,
    shouldCloseOnOverlayClick: PropTypes.bool,
    shouldReturnFocusAfterClose: PropTypes.bool,
    parentSelector: PropTypes.func,
    aria: PropTypes.object,
    data: PropTypes.object,
    role: PropTypes.string,
    contentLabel: PropTypes.string,
    shouldCloseOnEsc: PropTypes.bool,
    overlayRef: PropTypes.func,
    contentRef: PropTypes.func
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
    parentSelector: () => document.body
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

  // proxy
  static setAppElement = ariaAppHider.setElement;

  state = { action: CLOSED };

  constructor(props) {
    super(props);
    this.state.action = props.isOpen ? WILL_OPEN : CLOSED;
    this.timer = new EventTimer();
  }

  componentDidMount() {
    if (!canUseDOM) return;

    const { portalClassName, parentSelector } = this.props;

    if (!isReact16) {
      this.node = document.createElement("div");
    }
    this.node.className = portalClassName;

    const parent = parentSelector();
    parent.appendChild(this.node);

    if (this.props.isOpen) {
      this.beforeOpen();
      this.setState(
        { state: OPENED },
        () => {
          !isReact16 && this.renderPortal(this.props);
        }
      );
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    return {
      prevParent: prevProps.parentSelector(),
      nextParent: this.props.parentSelector()
    };
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
    (!prevProps.isOpen && !isOpen) && this.renderPortal(this.props);

    if (!prevProps.isOpen && this.props.isOpen) {
      this.open();
    } else if (prevProps.isOpen && !this.props.isOpen) {
      this.close();
    }
  }

  open = () => {
    this.beforeOpen();
  };

  close = () => {
    console.log("closing");
    this.setState({ state: WILL_CLOSE }, () => {
      if (!canUseDOM || !this.node || !this.portal) return;

      const { closeTimeoutMS } = this.props;
      const { state, isOpen, closesAt } = this.portal.state;
      const now = Date.now();

      if (this.props.isOpen && this.props.closeTimeoutMS) {

        const shouldClosesAt = closeTimeoutMS &&
              (closesAt || now + closeTimeoutMS) || null;
        this.setState(
          { state: WILL_CLOSE },
          () => this.timer.start(shouldClosesAt, () => {
            this.removePortal();
          })
        );
      } else {
        this.removePortal();
      }
    });
  };

  beforeOpen = () => {
    const {
      appElement,
      ariaHideApp,
      htmlOpenClassName,
      bodyOpenClassName
    } = this.props;

    // Remove classes.
    classList.add(document.body, bodyOpenClassName);

    htmlOpenClassName &&
      classList.add(
        document.getElementsByTagName("html")[0],
        htmlOpenClassName
      );

    if (this.props.ariaHideApp) {
      ariaHiddenInstances += 1;
      ariaAppHider.hide(this.props.appElement);
    }
  };

  afterClose = () => {
    const {
      appElement,
      ariaHideApp,
      htmlOpenClassName,
      bodyOpenClassName
    } = this.props;

    // Remove classes.
    classList.remove(document.body, bodyOpenClassName);

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
  };

  removePortal = () => {
    console.log("removing portal");
    this.afterClose();
    !isReact16 && ReactDOM.unmountComponentAtNode(this.node);
    const parent = this.props.parentSelector();
    parent.removeChild(this.node);
    this.afterClose();
  };

  portalRef = ref => (this.portal = ref);

  renderPortal = props => {
    const createPortal = getCreatePortal();
    const portal = createPortal(
      this,
      this.state.shouldRender == CLOSED ? null : (
        <ModalPortal defaultStyles={Modal.defaultStyles}
                     shouldRender={this.state.action}
                     {...props} />
      ),
      this.node
    );
    this.portalRef(portal);
  };

  render() {
    if (!canUseDOM || !isReact16) {
      return null;
    }

    if (!this.node && isReact16) {
      this.node = document.createElement("div");
    }

    const createPortal = getCreatePortal();
    return createPortal(
      this.state.shouldRender == CLOSED ?
        null : (
          <ModalPortal ref={this.portalRef}
                       defaultStyles={Modal.defaultStyles}
                       shouldRender={this.state.action}
                       {...this.props}
                       />
        ),
      this.node
    );
  }
}

polyfill(Modal);

export default Modal;
