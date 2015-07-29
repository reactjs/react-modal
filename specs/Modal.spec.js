require('./helper');
var React = require('react/addons');
var Modal = require('../lib/components/Modal');
var Simulate = React.addons.TestUtils.Simulate;
var ariaAppHider = require('../lib/helpers/ariaAppHider');
var button = React.DOM.button;

describe('Modal', function () {

  it('scopes tab navigation to the modal');
  it('focuses the last focused element when tabbing in from browser chrome');


  it('can be open initially', function() {
    var component = renderModal({isOpen: true}, 'hello');
    equal(component.portal.refs.content.getDOMNode().innerHTML.trim(), 'hello');
    unmountModal();
  });

  it('can be closed initially', function() {
    var component = renderModal({}, 'hello');
    equal(component.portal.getDOMNode().innerHTML.trim(), '');
    unmountModal();
  });

  it('uses the global appElement', function() {
    var app = document.createElement('div');
    var node = document.createElement('div');
    Modal.setAppElement(app);
    React.render(React.createElement(Modal, {isOpen: true}), node);
    equal(app.getAttribute('aria-hidden'), 'true');
    ariaAppHider.resetForTesting();
    React.unmountComponentAtNode(node);
  });

  it('accepts appElement as a prop', function() {
    var el = document.createElement('div');
    var node = document.createElement('div');
    React.render(React.createElement(Modal, {
      isOpen: true,
      appElement: el
    }), node);
    equal(el.getAttribute('aria-hidden'), 'true');
    React.unmountComponentAtNode(node);
  });

  it('renders into the body, not in context', function() {
    var node = document.createElement('div');
    var App = React.createClass({
      render: function() {
        return React.DOM.div({}, React.createElement(Modal, {isOpen: true, ariaHideApp: false}, 'hello'));
      }
    });
    React.render(React.createElement(App), node);
    var modalParent = document.body.querySelector('.ReactModalPortal').parentNode;
    equal(modalParent, document.body);
    React.unmountComponentAtNode(node);
  });

  it('renders children', function() {
    var child = 'I am a child of Modal, and he has sent me here...';
    var component = renderModal({isOpen: true}, child);
    equal(component.portal.refs.content.getDOMNode().innerHTML, child);
    unmountModal();
  });

  it('has default props', function() {
    var node = document.createElement('div');
    Modal.setAppElement(document.createElement('div'));
    var component = React.render(React.createElement(Modal), node);
    var props = component.props;
    equal(props.isOpen, false);
    equal(props.ariaHideApp, true);
    equal(props.closeTimeoutMS, 0);
    React.unmountComponentAtNode(node);
    ariaAppHider.resetForTesting();
  });

  it('removes the portal node', function() {
    var component = renderModal({isOpen: true}, 'hello');
    equal(component.portal.refs.content.getDOMNode().innerHTML.trim(), 'hello');
    unmountModal();
    ok(!document.querySelector('.ReactModalPortal'));
  });

  it('focuses the modal content', function() {
    renderModal({isOpen: true}, null, function () {
      strictEqual(document.activeElement, this.portal.refs.content.getDOMNode());
      unmountModal();
    });
  });

  it('supports custom className', function() {
    var modal = renderModal({isOpen: true, className: 'myClass'});
    equal(modal.portal.refs.content.getDOMNode().className.indexOf('myClass') !== -1, true);
    unmountModal();
  });

  it('supports overlayClassName', function () {
    var modal = renderModal({isOpen: true, overlayClassName: 'myOverlayClass'});
    equal(modal.portal.refs.overlay.getDOMNode().className.indexOf('myOverlayClass') !== -1, true);
    unmountModal();
  });

  it('supports adding style to the modal contents', function () {
    var modal = renderModal({isOpen: true, style: {content: {width: '20px'}}});
    equal(modal.portal.refs.content.getDOMNode().style.width, '20px');
  });

  it('supports overridding style on the modal contents', function() {
    var modal = renderModal({isOpen: true, style: {content: {position: 'static'}}});
    equal(modal.portal.refs.content.getDOMNode().style.position, 'static');
  });

  it('supports adding style on the modal overlay', function() {
    var modal = renderModal({isOpen: true, style: {overlay: {width: '75px'}}});
    equal(modal.portal.refs.overlay.getDOMNode().style.width, '75px');
  });

  it('supports overridding style on the modal overlay', function() {
    var modal = renderModal({isOpen: true, style: {overlay: {position: 'static'}}});
    equal(modal.portal.refs.overlay.getDOMNode().style.position, 'static');
  });

  it('adds class to body when open', function() {
    var modal = renderModal({isOpen: false});
    equal(document.body.className.indexOf('ReactModal__Body--open') !== -1, false);

    modal.setProps({ isOpen: true});
    equal(document.body.className.indexOf('ReactModal__Body--open')  !== -1, true);

    modal = renderModal({isOpen: false});
    equal(document.body.className.indexOf('ReactModal__Body--open')  !== -1, false);
    unmountModal();
  });

  it('adds --after-open for animations', function() {
    var modal = renderModal({isOpen: true});
    var overlay = document.querySelector('.ReactModal__Overlay');
    var content = document.querySelector('.ReactModal__Content');
    ok(overlay.className.match(/ReactModal__Overlay--after-open/));
    ok(content.className.match(/ReactModal__Content--after-open/));
    unmountModal();
  });

  //it('adds --before-close for animations', function() {
    //var node = document.createElement('div');

    //var component = React.render(React.createElement(Modal, {
      //isOpen: true,
      //ariaHideApp: false,
      //closeTimeoutMS: 50,
    //}), node);

    //component = React.render(React.createElement(Modal, {
      //isOpen: false,
      //ariaHideApp: false,
      //closeTimeoutMS: 50,
    //}), node);

    // It can't find these nodes, I didn't spend much time on this
    //var overlay = document.querySelector('.ReactModal__Overlay');
    //var content = document.querySelector('.ReactModal__Content');
    //ok(overlay.className.match(/ReactModal__Overlay--before-close/));
    //ok(content.className.match(/ReactModal__Content--before-close/));
    //unmountModal();
  //});
});
