import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ExecutionEnvironment from 'exenv';
import ModalPortal from './ModalPortal';
import elementClass from 'element-class';
import * as ariaAppHider from '../helpers/ariaAppHider';
import * as refCount from '../helpers/refCount';

var renderSubtreeIntoContainer = ReactDOM.unstable_renderSubtreeIntoContainer;

var SafeHTMLElement = ExecutionEnvironment.canUseDOM ? window.HTMLElement : {};
var AppElement = ExecutionEnvironment.canUseDOM ? document.body : {appendChild: function() {}};

function getParentElement(parentSelector) {
  return parentSelector();
}

export default class Modal extends Component {
  static setAppElement = function(element) {
    AppElement = ariaAppHider.setElement(element);
  };

  static injectCSS = function() {
    "production" !== process.env.NODE_ENV
      && console.warn('React-Modal: injectCSS has been deprecated ' +
                      'and no longer has any effect. It will be removed in a later version');
  };

  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    style: PropTypes.shape({
      content: PropTypes.object,
      overlay: PropTypes.object
    }),
    portalClassName: PropTypes.string,
    bodyOpenClassName: PropTypes.string,
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

  static defaultProps = {
    isOpen: false,
    portalClassName: 'ReactModalPortal',
    bodyOpenClassName: 'ReactModal__Body--open',
    ariaHideApp: true,
    closeTimeoutMS: 0,
    shouldCloseOnOverlayClick: true,
    parentSelector: function () { return document.body; }
  };

  static defaultStyles = {
    overlay: {
      position        : 'fixed',
      top             : 0,
      left            : 0,
      right           : 0,
      bottom          : 0,
      backgroundColor : 'rgba(255, 255, 255, 0.75)'
    },
    content: {
      position                : 'absolute',
      top                     : '40px',
      left                    : '40px',
      right                   : '40px',
      bottom                  : '40px',
      border                  : '1px solid #ccc',
      background              : '#fff',
      overflow                : 'auto',
      WebkitOverflowScrolling : 'touch',
      borderRadius            : '4px',
      outline                 : 'none',
      padding                 : '20px'
    }
  };

  componentDidMount() {
    this.node = document.createElement('div');
    this.node.className = this.props.portalClassName;

    if (this.props.isOpen) refCount.add(this);

    var parent = getParentElement(this.props.parentSelector);
    parent.appendChild(this.node);
    this.renderPortal(this.props);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.isOpen) refCount.add(this);
    if (!newProps.isOpen) refCount.remove(this);
    var currentParent = getParentElement(this.props.parentSelector);
    var newParent = getParentElement(newProps.parentSelector);

    if(newParent !== currentParent) {
      currentParent.removeChild(this.node);
      newParent.appendChild(this.node);
    }

    this.renderPortal(newProps);
  }

  componentWillUnmount() {
    if (!this.node) return;

    refCount.remove(this);

    if (this.props.ariaHideApp) {
      ariaAppHider.show(this.props.appElement);
    }

    var state = this.portal.state;
    var now = Date.now();
    var closesAt = state.isOpen && this.props.closeTimeoutMS
      && (state.closesAt
        || now + this.props.closeTimeoutMS);

    if (closesAt) {
      if (!state.beforeClose) {
        this.portal.closeWithTimeout();
      }

      var that = this;
      setTimeout(function() { that.removePortal(); }, closesAt - now);
    } else {
      this.removePortal();
    }
  }

  removePortal = () => {
    ReactDOM.unmountComponentAtNode(this.node);
    var parent = getParentElement(this.props.parentSelector);
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
