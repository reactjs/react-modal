/** @jsx React.DOM */
var React = require('react');
var ModalPortal = require('./ModalPortal');
var ariaAppHider = require('../helpers/ariaAppHider');
var injectCSS = require('../helpers/injectCSS');

var Modal = module.exports = React.createClass({

  displayName: 'Modal',

  statics: {
    setAppElement: ariaAppHider.setElement,
    injectCSS: injectCSS
  },

  propTypes: {
    isOpen: React.PropTypes.bool.isRequired,
    dismissable: React.PropTypes.bool,
    appElement: React.PropTypes.instanceOf(HTMLElement),
    closeTimeoutMS: React.PropTypes.number
  },

  getDefaultProps: function () {
    return {
      isOpen: false,
      dismissable: false,
      ariaHideApp: true,
      closeTimeoutMS: 0
    };
  },

  componentDidMount: function() {
    this.node = document.createElement('div');
    this.node.className = 'ReactModalPortal';
    document.body.appendChild(this.node);
    this.renderPortal(this.props);
  },

  componentWillReceiveProps: function(newProps) {
    this.renderPortal(newProps);
  },

  componentWillUnmount: function() {
    React.unmountComponentAtNode(this.node);
    document.body.removeChild(this.node);
  },

  renderPortal: function(props) {
    if (props.ariaHideApp) {
      ariaAppHider.toggle(props.isOpen, props.appElement);
    }
    var portalProps = {
      isOpen: props.isOpen,
      dismissable: props.dismissable,
      closeTimeoutMS: props.closeTimeoutMS,
      children: props.children
    };
    this.portal = React.renderComponent(ModalPortal(portalProps), this.node);
  },

  open: function(cb) {
    this.portal.open(cb);
  },

  close: function(cb) {
    this.portal.close(cb);
  },

  render: function () {
    return null;
  }
});

