var React = require('react');
var ExecutionEnvironment = require('react/lib/ExecutionEnvironment');
var ModalPortal = React.createFactory(require('./ModalPortal'));
var ariaAppHider = require('../helpers/ariaAppHider');
var elementClass = require('element-class');

var SafeHTMLElement = ExecutionEnvironment.canUseDOM ? window.HTMLElement : {};

var Modal = module.exports = React.createClass({

  displayName: 'Modal',
  statics: {
    setAppElement: ariaAppHider.setElement,
    injectCSS : function() {
      "production" !== process.env.NODE_ENV
        && console.warn('React-Modal: injectCSS has been deprecated ' +
                        'and no longer has any effect. It will be removed in a later version');
    }
  },

  propTypes: {
    isOpen: React.PropTypes.bool.isRequired,
    style : React.PropTypes.shape({
      content: React.PropTypes.object,
      overlay: React.PropTypes.object
    }),
    appElement: React.PropTypes.instanceOf(SafeHTMLElement),
    onRequestClose: React.PropTypes.func,
    closeTimeoutMS: React.PropTypes.number,
    ariaHideApp: React.PropTypes.bool
  },

  getDefaultProps: function () {
    return {
      isOpen: false,
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
    if (props.isOpen) {
      elementClass(document.body).add('ReactModal__Body--open');
    } else {
      elementClass(document.body).remove('ReactModal__Body--open');
    }

    if (props.ariaHideApp) {
      ariaAppHider.toggle(props.isOpen, props.appElement);
    }
    sanitizeProps(props);
    if (this.portal)
      this.portal.setProps(props);
    else
      this.portal = React.render(ModalPortal(props), this.node);
  },

  render: function () {
    return React.DOM.noscript();
  }
});

function sanitizeProps(props) {
  delete props.ref;
}
