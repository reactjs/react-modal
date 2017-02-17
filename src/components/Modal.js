import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import elementClass from 'element-class';
import ModalPortal from './ModalPortal';
import * as ariaAppHider from '../helpers/ariaAppHider';

const renderSubtreeIntoContainer = ReactDOM.unstable_renderSubtreeIntoContainer;


function getParentElement (parentSelector) {
  return parentSelector();
}

export default class Modal extends Component {

  /* eslint-disable react/no-unused-prop-types */
  static propTypes = {
    isOpen: React.PropTypes.bool.isRequired,
    style: React.PropTypes.shape({
      content: React.PropTypes.object,
      overlay: React.PropTypes.object
    }),
    portalClassName: React.PropTypes.string,
    bodyOpenClassName: React.PropTypes.string,
    /**
     * A function that returns the appElement that will be aria-hidden
     * when the modal is open. The function should return a DOMElement or
     * an array of DOMElements.
     */
    getAppElement: React.PropTypes.func.isRequired,
    onAfterOpen: React.PropTypes.func,
    onRequestClose: React.PropTypes.func,
    closeTimeoutMS: React.PropTypes.number,
    ariaHideApp: React.PropTypes.bool,
    shouldCloseOnOverlayClick: React.PropTypes.bool,
    parentSelector: React.PropTypes.func,
    role: React.PropTypes.string,
    contentLabel: React.PropTypes.string.isRequired
  };
  /* eslint-enable react/no-unused-prop-types */

  static defaultProps = {
    isOpen: false,
    portalClassName: 'ReactModalPortal',
    bodyOpenClassName: 'ReactModal__Body--open',
    ariaHideApp: true,
    closeTimeoutMS: 0,
    shouldCloseOnOverlayClick: true,
    parentSelector () { return document.body; }
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

  static injectCSS () {
    return process.env.NODE_ENV !== 'production'
        && console.warn('React-Modal: injectCSS has been deprecated ' +
                        'and no longer has any effect. It will be removed in a later version');
  }

  componentDidMount () {
    this.node = document.createElement('div');
    this.node.className = this.props.portalClassName;

    const parent = getParentElement(this.props.parentSelector);
    parent.appendChild(this.node);
    this.renderPortal(this.props);
  }

  componentWillReceiveProps (newProps) {
    const currentParent = getParentElement(this.props.parentSelector);
    const newParent = getParentElement(newProps.parentSelector);

    if (newParent !== currentParent) {
      currentParent.removeChild(this.node);
      newParent.appendChild(this.node);
    }

    this.renderPortal(newProps);
  }

  componentWillUnmount () {
    if (this.props.ariaHideApp) {
      ariaAppHider.show(this.props.getAppElement());
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

      setTimeout(this.removePortal.bind(this), closesAt - now);
    } else {
      this.removePortal();
    }
  }

  removePortal () {
    ReactDOM.unmountComponentAtNode(this.node);
    const parent = getParentElement(this.props.parentSelector);
    parent.removeChild(this.node);
    elementClass(document.body).remove(this.props.bodyOpenClassName);
  }

  renderPortal (props) {
    if (props.isOpen) {
      elementClass(document.body).add(this.props.bodyOpenClassName);
    } else {
      elementClass(document.body).remove(this.props.bodyOpenClassName);
    }

    if (props.ariaHideApp) {
      ariaAppHider.toggle(this.props.getAppElement(), props.isOpen);
    }

    this.portal = renderSubtreeIntoContainer(this,
      <ModalPortal
        {...props}
        defaultStyles={Modal.defaultStyles}
      />, this.node);
  }

  render () {
    return null;
  }
}
