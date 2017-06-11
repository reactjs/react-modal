/* eslint-env mocha */
import sinon from 'sinon';
import expect from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Modal from '../lib/components/Modal';
import * as ariaAppHider from '../lib/helpers/ariaAppHider';
import {
  isBodyWithReactModalOpenClass, findDOMWithClass,
  contentAttribute, overlayAttribute,
  mcontent, moverlay,
  clickAt, mouseDownAt, mouseUpAt, escKeyDown, tabKeyDown,
  renderModal, unmountModal, emptyDOM
} from './helper';

import * as events from './Modal.events.spec';
import * as styles from './Modal.style.spec';

const Simulate = TestUtils.Simulate;

describe('State', () => {
  afterEach('check if test cleaned up rendered modals', emptyDOM);

  it('scopes tab navigation to the modal');
  it('focuses the last focused element when tabbing in from browser chrome');
  it('renders children [tested indirectly]');

  it('can be open initially', () => {
    const modal = renderModal({ isOpen: true }, 'hello');
    expect(mcontent(modal)).toExist();
  });

  it('can be closed initially', () => {
    var modal = renderModal({}, 'hello');
    expect(ReactDOM.findDOMNode(mcontent(modal))).toNotExist();
  });

  it('has default props', () => {
    var node = document.createElement('div');
    Modal.setAppElement(document.createElement('div'));
    var modal = ReactDOM.render(<Modal />, node);
    var props = modal.props;
    expect(props.isOpen).toBe(false);
    expect(props.ariaHideApp).toBe(true);
    expect(props.closeTimeoutMS).toBe(0);
    expect(props.shouldCloseOnOverlayClick).toBe(true);
    ReactDOM.unmountComponentAtNode(node);
    ariaAppHider.resetForTesting();
    Modal.setAppElement(document.body);  // restore default
  });

  it('accepts appElement as a prop', () => {
    var el = document.createElement('div');
    var node = document.createElement('div');
    ReactDOM.render((
      <Modal isOpen={true} appElement={el} />
    ), node);
    expect(el.getAttribute('aria-hidden')).toEqual('true');
    ReactDOM.unmountComponentAtNode(node);
  });

  it('renders into the body, not in context', () => {
    var node = document.createElement('div');
    var App = React.createClass({
      render() {
        return (
          <div>
            <Modal isOpen={true}>
              <span>hello</span>
            </Modal>
          </div>
        );
      }
    });
    Modal.setAppElement(node);
    ReactDOM.render(<App />, node);
    expect(
      document.body.querySelector('.ReactModalPortal').parentNode
    ).toEqual(
      document.body
    );
    ReactDOM.unmountComponentAtNode(node);
  });

  it('renders the modal content with a dialog aria role when provided ', () => {
    var child = 'I am a child of Modal, and he has sent me here...';
    var modal = renderModal({ isOpen: true, role: 'dialog' }, child);
    expect(contentAttribute(modal, 'role')).toEqual('dialog');
  });

  it('renders the modal with a aria-label based on the contentLabel prop', () => {
    var child = 'I am a child of Modal, and he has sent me here...';
    var modal = renderModal({ isOpen: true, contentLabel: 'Special Modal' }, child);
    expect(contentAttribute(modal, 'aria-label')).toEqual('Special Modal');
  });

  it('removes the portal node', () => {
    var modal = renderModal({ isOpen: true }, 'hello');
    unmountModal();
    expect(document.querySelector('.ReactModalPortal')).toNotExist();
  });

  it('focuses the modal content', () => {
    const modal = renderModal({ isOpen: true }, null);
    expect(document.activeElement).toBe(mcontent(modal));
  });

  it('give back focus to previous element or modal.', done => {
    function cleanup () {
      unmountModal();
      done();
    }
    const modalA = renderModal({
      isOpen: true,
      className: 'modal-a',
      onRequestClose () {
        cleanup();
      }
    }, null);

    const modalContent = mcontent(modalA);
    expect(document.activeElement).toEqual(modalContent);

    const modalB = renderModal({
      isOpen: true,
      className: 'modal-b',
      onRequestClose: function() {
        const modalContent = mcontent(modalB);
        expect(document.activeElement).toEqual(mcontent(modalA));
        escKeyDown(modalContent);
        expect(document.activeElement).toEqual(modalContent);
      }
    }, null);

    escKeyDown(modalContent);
  });

  it('does not steel focus when a descendent is already focused', () => {
    var content;
    var input = (
      <input className="focus_input" ref={(el) => { el && el.focus(); content = el; }} />
    );
    renderModal({ isOpen: true }, input, function () {
      expect(document.activeElement).toEqual(content);
    });
  });

  it('supports portalClassName', () => {
    var modal = renderModal({
      isOpen: true,
      portalClassName: 'myPortalClass'
    });
    expect(modal.node.className.includes('myPortalClass')).toBeTruthy();
  });

  it('supports custom className', () => {
    const modal = renderModal({ isOpen: true, className: 'myClass' });
    expect(
      mcontent(modal).className.includes('myClass')
    ).toBeTruthy();
  });

  it('supports overlayClassName', () => {
    const modal = renderModal({
      isOpen: true,
      overlayClassName: 'myOverlayClass'
    });
    expect(
      moverlay(modal).className.includes('myOverlayClass')
    ).toBeTruthy();
  });

  it('overrides the default content classes when a custom object className is used', () => {
    const modal = renderModal({
      isOpen: true,
      className: {
        base: 'myClass',
        afterOpen: 'myClass_after-open',
        beforeClose: 'myClass_before-close'
      }
    });
    expect(mcontent(modal).className).toEqual('myClass myClass_after-open');
    unmountModal();
  });

  it('overrides the default overlay classes when a custom object overlayClassName is used', () => {
    const modal = renderModal({
      isOpen: true,
      overlayClassName: {
        base: 'myOverlayClass',
        afterOpen: 'myOverlayClass_after-open',
        beforeClose: 'myOverlayClass_before-close'
      }
    });
    expect(moverlay(modal).className).toEqual('myOverlayClass myOverlayClass_after-open');
    unmountModal();
  });

  it('supports overriding react modal open class in document.body.', () => {
    const modal = renderModal({ isOpen: true, bodyOpenClassName: 'custom-modal-open' });
    expect(document.body.className.indexOf('custom-modal-open') !== -1).toBeTruthy();
  });

  it('don\'t append class to document.body if modal is not open', () => {
    renderModal({ isOpen: false });
    expect(!isBodyWithReactModalOpenClass()).toBeTruthy();
    unmountModal();
  });

  it('append class to document.body if modal is open', () => {
    renderModal({ isOpen: true });
    expect(isBodyWithReactModalOpenClass()).toBeTruthy();
    unmountModal();
  });

  it('removes class from document.body when unmounted without closing', () => {
    renderModal({ isOpen: true });
    unmountModal();
    expect(!isBodyWithReactModalOpenClass()).toBeTruthy();
  });

  it('remove class from document.body when no modals opened', () => {
    renderModal({ isOpen: true });
    renderModal({ isOpen: true });
    expect(isBodyWithReactModalOpenClass()).toBeTruthy();
    unmountModal();
    expect(isBodyWithReactModalOpenClass()).toBeTruthy();
    unmountModal();
    expect(!isBodyWithReactModalOpenClass()).toBeTruthy();
  });

  it('removes aria-hidden from appElement when unmounted without closing', () => {
    var el = document.createElement('div');
    var node = document.createElement('div');
    ReactDOM.render((
      <Modal isOpen={true} appElement={el}></Modal>
    ), node);
    expect(el.getAttribute('aria-hidden')).toEqual('true');
    ReactDOM.unmountComponentAtNode(node);
    expect(el.getAttribute('aria-hidden')).toEqual(null);
  });

  it('adds --after-open for animations', () => {
    const modal = renderModal({ isOpen: true });
    var rg = /--after-open/i;
    expect(rg.test(mcontent(modal).className)).toBeTruthy();
    expect(rg.test(moverlay(modal).className)).toBeTruthy();
  });

  it('adds --before-close for animations', () => {
    const closeTimeoutMS = 50;
    const modal = renderModal({
      isOpen: true,
      closeTimeoutMS
    });
    modal.portal.closeWithTimeout();

    const rg = /--before-close/i;
    expect(rg.test(moverlay(modal).className)).toBeTruthy();
    expect(rg.test(mcontent(modal).className)).toBeTruthy();

    modal.portal.closeWithoutTimeout();
  });

  it('check the state of the modal after close with time out and reopen it', () => {
    var modal = renderModal({
      isOpen: true,
      closeTimeoutMS: 2000,
      onRequestClose: function() {}
    });
    modal.portal.closeWithTimeout();
    modal.portal.open();
    modal.portal.closeWithoutTimeout();
    expect(!modal.portal.state.isOpen).toBeTruthy();
  });

  it('verify default prop of shouldCloseOnOverlayClick', () => {
    const modal = renderModal({ isOpen: true });
    expect(modal.props.shouldCloseOnOverlayClick).toBeTruthy();
  });

  it('verify prop of shouldCloseOnOverlayClick', () => {
    var modalOpts = { isOpen: true, shouldCloseOnOverlayClick: false };
    var modal = renderModal(modalOpts);
    expect(!modal.props.shouldCloseOnOverlayClick).toBeTruthy();
  });

  it('keeps the modal in the DOM until closeTimeoutMS elapses', done => {
    const closeTimeoutMS = 100;

    const modal = renderModal({ isOpen: true, closeTimeoutMS });
    modal.portal.closeWithTimeout();

    function checkDOM(count) {
      const overlay = document.querySelectorAll('.ReactModal__Overlay');
      const content = document.querySelectorAll('.ReactModal__Content');
      expect(overlay.length).toBe(count);
      expect(content.length).toBe(count);
    }

    // content is still mounted after modal is gone
    checkDOM(1);

    setTimeout(() => {
      // content is unmounted after specified timeout
      checkDOM(0);
      done();
    }, closeTimeoutMS);
  });
});
