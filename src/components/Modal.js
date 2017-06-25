import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ExecutionEnvironment from 'exenv';
import elementClass from 'element-class';
import ModalPortal from './ModalPortal';
import * as ariaAppHider from '../helpers/ariaAppHider';
import * as refCount from '../helpers/refCount';

const EE = ExecutionEnvironment;
const renderSubtreeIntoContainer = ReactDOM.unstable_renderSubtreeIntoContainer;

const SafeHTMLElement = EE.canUseDOM ? window.HTMLElement : {};

function getParentElement(parentSelector) {
  return parentSelector();
}

export default class Modal extends Component {
  static setAppElement(element) {
    ariaAppHider.setElement(element);
  }

  /* eslint-disable no-console */
  static injectCSS() {
    (process.env.NODE_ENV !== "production")
      && console.warn(
        'React-Modal: injectCSS has been deprecated ' +
          'and no longer has any effect. It will be removed in a later version'
      );
  }
  /* eslint-enable no-console */

  /* eslint-disable react/no-unused-prop-types */
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    style: PropTypes.shape({
      content: PropTypes.object,
      overlay: PropTypes.object
    }),
    portalClassName: PropTypes.string,
    bodyOpenClassName: PropTypes.string,
    className: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    overlayClassName: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    appElement: PropTypes.instanceOf(SafeHTMLElement),
    onAfterOpen: PropTypes.func,
    onRequestClose: PropTypes.func,
    closeTimeoutMS: PropTypes.number,
    ariaHideApp: PropTypes.bool,
    shouldCloseOnOverlayClick: PropTypes.bool,
    parentSelector: PropTypes.func,
    role: PropTypes.string,
    contentLabel: PropTypes.string.isRequired
  };
  /* eslint-enable react/no-unused-prop-types */

  static defaultProps = {
    isOpen: false,
    portalClassName: 'ReactModalPortal',
    bodyOpenClassName: 'ReactModal__Body--open',
    ariaHideApp: true,
    closeTimeoutMS: 0,
    shouldCloseOnOverlayClick: true,
    parentSelector() { return document.body; }
  };

  static defaultStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.75)'
    },
    content: {
      position: 'absolute',
      top: '40px',
      left: '40px',
      right: '40px',
      bottom: '40px',
      border: '1px solid #ccc',
      background: '#fff',
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
      borderRadius: '4px',
      outline: 'none',
      padding: '20px'
    }
  };

  componentDidMount() {
    this.node = document.createElement('div');
    this.node.className = this.props.portalClassName;

    if (this.props.isOpen) refCount.add(this);

    const parent = getParentElement(this.props.parentSelector);
    parent.appendChild(this.node);
    this.renderPortal(this.props);
  }

  componentWillReceiveProps(newProps) {
    const { isOpen } = newProps;
    // Stop unnecessary renders if modal is remaining closed
    if (!this.props.isOpen && !isOpen) return;

    if (isOpen) refCount.add(this);
    if (!isOpen) refCount.remove(this);
    const currentParent = getParentElement(this.props.parentSelector);
    const newParent = getParentElement(newProps.parentSelector);

    if (newParent !== currentParent) {
      currentParent.removeChild(this.node);
      newParent.appendChild(this.node);
    }

    this.renderPortal(newProps);
  }

  componentWillUpdate(newProps) {
    if (newProps.portalClassName !== this.props.portalClassName) {
      this.node.className = newProps.portalClassName;
    }
  }

  componentWillUnmount() {
    if (!this.node) return;

    refCount.remove(this);

    if (this.props.ariaHideApp) {
      ariaAppHider.show(this.props.appElement);
    }

    const state = this.portal.state;
    const now = Date.now();
    const closesAt = state.isOpen && this.props.closeTimeoutMS
      && (state.closesAt
        || now + this.props.closeTimeoutMS);

    if (closesAt) {
      if (!state.beforeClose) {
        this.portal.closeWithTimeout();
      }

      setTimeout(() => this.removePortal, closesAt - now);
    } else {
      this.removePortal();
    }
  }

  removePortal = () => {
    ReactDOM.unmountComponentAtNode(this.node);
    const parent = getParentElement(this.props.parentSelector);
    parent.removeChild(this.node);

    if (refCount.count() === 0) {
      elementClass(document.body).remove(this.props.bodyOpenClassName);
    }
  }

  renderPortal = props => {
    if (props.isOpen || refCount.count() > 0) {
      elementClass(document.body).add(this.props.bodyOpenClassName);
    } else {
      elementClass(document.body).remove(this.props.bodyOpenClassName);
    }

    if (props.ariaHideApp) {
      ariaAppHider.toggle(props.isOpen, props.appElement);
    }

    this.portal = renderSubtreeIntoContainer(this, (
      <ModalPortal defaultStyles={Modal.defaultStyles} {...props} />
    ), this.node);
  }

  render() {
    return null;
  }
}
