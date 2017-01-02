/* eslint-env mocha */

// The following eslint overrides should be removed when refactoring can occur

/* eslint react/no-find-dom-node: "warn",
          react/no-render-return-value: "warn"
*/
import TestUtils from 'react-addons-test-utils';
import React from 'react';
import sinon from 'sinon';
import expect from 'expect';
import ReactDOM from 'react-dom';
import Modal from '../lib/components/Modal';
import ariaAppHider from '../lib/helpers/ariaAppHider';
import { renderModal, unmountModal } from './helper';

const Simulate = TestUtils.Simulate;


describe('Modal', () => {
  it('scopes tab navigation to the modal');
  it('focuses the last focused element when tabbing in from browser chrome');

  it('can be open initially', () => {
    const component = renderModal({ isOpen: true }, 'hello');
    expect(component.portal.content.innerHTML.trim()).toEqual('hello');
    unmountModal();
  });

  it('can be closed initially', () => {
    const component = renderModal({}, 'hello');
    expect(ReactDOM.findDOMNode(component.portal).innerHTML.trim()).toEqual('');
    unmountModal();
  });

  it('accepts appElement as a prop', () => {
    const el = document.createElement('div');
    const node = document.createElement('div');
    ReactDOM.render(
      <Modal
        isOpen
        appElement={el}
      />
    , node);
    expect(el.getAttribute('aria-hidden')).toEqual('true');
    ReactDOM.unmountComponentAtNode(node);
  });

  it('renders into the body, not in context', () => {
    const node = document.createElement('div');
    const App = () => (
      <div>
        <Modal isOpen>
          hello
        </Modal>
      </div>
    );
    Modal.setAppElement(node);
    ReactDOM.render(<App />, node);
    const modalParent = document.body.querySelector('.ReactModalPortal').parentNode;
    expect(modalParent).toEqual(document.body);
    ReactDOM.unmountComponentAtNode(node);
  });

  it('renders children', () => {
    const child = 'I am a child of Modal, and he has sent me here...';
    const component = renderModal({ isOpen: true }, child);
    expect(component.portal.content.innerHTML).toEqual(child);
    unmountModal();
  });

  it('renders the modal content with a dialog aria role when provided ', () => {
    const child = 'I am a child of Modal, and he has sent me here...';
    const component = renderModal({ isOpen: true, role: 'dialog' }, child);
    expect(component.portal.content.getAttribute('role')).toEqual('dialog');
    unmountModal();
  });

  it('renders the modal with a aria-label based on the contentLabel prop', () => {
    const child = 'I am a child of Modal, and he has sent me here...';
    const component = renderModal({ isOpen: true, contentLabel: 'Special Modal' }, child);
    expect(component.portal.content.getAttribute('aria-label')).toEqual('Special Modal');
    unmountModal();
  });

  it('has default props', () => {
    const node = document.createElement('div');
    Modal.setAppElement(document.createElement('div'));
    const component = ReactDOM.render(<Modal />, node);
    const props = component.props;
    expect(props.isOpen).toBe(false);
    expect(props.ariaHideApp).toBe(true);
    expect(props.closeTimeoutMS).toBe(0);
    expect(props.shouldCloseOnOverlayClick).toBe(true);
    ReactDOM.unmountComponentAtNode(node);
    ariaAppHider.resetForTesting();
    Modal.setAppElement(document.body);  // restore default
  });

  it('removes the portal node', () => {
    const component = renderModal({ isOpen: true }, 'hello');
    expect(component.portal.content.innerHTML.trim()).toEqual('hello');
    unmountModal();
    expect(!document.querySelector('.ReactModalPortal')).toExist();
  });

  it('focuses the modal content', () => {
    renderModal({ isOpen: true }, null, function checkModalContentFocus () {
      expect(document.activeElement).toEqual(this.portal.content);
      unmountModal();
    });
  });

  it('does not focus the modal content when a descendent is already focused', () => {
    const input = (
      <input
        className="focus_input"
        ref={el => (el && el.focus())}
      />
    );

    renderModal({ isOpen: true }, input, () => {
      expect(document.activeElement).toEqual(document.querySelector('.focus_input'));
      unmountModal();
    });
  });

  it('handles case when child has no tabbable elements', () => {
    const component = renderModal({ isOpen: true }, 'hello');
    expect(() => {
      Simulate.keyDown(component.portal.content, { key: 'Tab', keyCode: 9, which: 9 });
    }).toNotThrow();
    unmountModal();
  });

  it('keeps focus inside the modal when child has no tabbable elements', () => {
    let tabPrevented = false;
    const modal = renderModal({ isOpen: true }, 'hello');
    expect(document.activeElement).toEqual(modal.portal.content);
    Simulate.keyDown(modal.portal.content, {
      key: 'Tab',
      keyCode: 9,
      which: 9,
      preventDefault () { tabPrevented = true; }
    });
    expect(tabPrevented).toEqual(true);
  });

  it('supports portalClassName', () => {
    const modal = renderModal({ isOpen: true, portalClassName: 'myPortalClass' });
    expect(modal.node.className).toEqual('myPortalClass');
    unmountModal();
  });

  it('supports custom className', () => {
    const modal = renderModal({ isOpen: true, className: 'myClass' });
    expect(modal.portal.content.className.indexOf('myClass')).toNotEqual(-1);
    unmountModal();
  });

  it('supports overlayClassName', () => {
    const modal = renderModal({ isOpen: true, overlayClassName: 'myOverlayClass' });
    expect(modal.portal.overlay.className.indexOf('myOverlayClass')).toNotEqual(-1);
    unmountModal();
  });

  it('overrides the default styles when a custom classname is used', () => {
    const modal = renderModal({ isOpen: true, className: 'myClass' });
    expect(modal.portal.content.style.top).toEqual('');
    unmountModal();
  });

  it('overrides the default styles when a custom overlayClassName is used', () => {
    const modal = renderModal({ isOpen: true, overlayClassName: 'myOverlayClass' });
    expect(modal.portal.overlay.style.backgroundColor).toEqual('');
  });

  it('supports adding style to the modal contents', () => {
    const modal = renderModal({ isOpen: true, style: { content: { width: '20px' } } });
    expect(modal.portal.content.style.width).toEqual('20px');
  });

  it('supports overriding style on the modal contents', () => {
    const modal = renderModal({ isOpen: true, style: { content: { position: 'static' } } });
    expect(modal.portal.content.style.position).toEqual('static');
  });

  it('supports adding style on the modal overlay', () => {
    const modal = renderModal({ isOpen: true, style: { overlay: { width: '75px' } } });
    expect(modal.portal.overlay.style.width).toEqual('75px');
  });

  it('supports overriding style on the modal overlay', () => {
    const modal = renderModal({ isOpen: true, style: { overlay: { position: 'static' } } });
    expect(modal.portal.overlay.style.position).toEqual('static');
  });

  it('supports overriding the default styles', () => {
    const previousStyle = Modal.defaultStyles.content.position;
    // Just in case the default style is already relative, check that we can change it
    const newStyle = previousStyle === 'relative' ? 'static' : 'relative';
    Modal.defaultStyles.content.position = newStyle;
    const modal = renderModal({ isOpen: true });
    expect(modal.portal.content.style.position).toEqual(newStyle);
    Modal.defaultStyles.content.position = previousStyle;
  });

  it('adds class to body when open', () => {
    renderModal({ isOpen: false });
    expect(document.body.className.indexOf('ReactModal__Body--open') !== -1).toEqual(false);

    renderModal({ isOpen: true });
    expect(document.body.className.indexOf('ReactModal__Body--open') !== -1).toEqual(true);

    renderModal({ isOpen: false });
    expect(document.body.className.indexOf('ReactModal__Body--open') !== -1).toEqual(false);
    unmountModal();
  });

  it('removes class from body when unmounted without closing', () => {
    renderModal({ isOpen: true });
    expect(document.body.className.indexOf('ReactModal__Body--open') !== -1).toEqual(true);
    unmountModal();
    expect(document.body.className.indexOf('ReactModal__Body--open') !== -1).toEqual(false);
  });

  it('removes aria-hidden from appElement when unmounted without closing', () => {
    const el = document.createElement('div');
    const node = document.createElement('div');
    ReactDOM.render(React.createElement(Modal, {
      isOpen: true,
      appElement: el
    }), node);
    expect(el.getAttribute('aria-hidden')).toEqual('true');
    ReactDOM.unmountComponentAtNode(node);
    expect(el.getAttribute('aria-hidden')).toEqual(null);
  });

  it('adds --after-open for animations', () => {
    renderModal({ isOpen: true });
    const overlay = document.querySelector('.ReactModal__Overlay');
    const content = document.querySelector('.ReactModal__Content');
    expect(overlay.className.match(/ReactModal__Overlay--after-open/)).toExist();
    expect(content.className.match(/ReactModal__Content--after-open/)).toExist();
    unmountModal();
  });

  it('should trigger the onAfterOpen callback', () => {
    const afterOpenCallback = sinon.spy();
    renderModal({
      isOpen: true,
      onAfterOpen () {
        afterOpenCallback();
      }
    });
    expect(afterOpenCallback.called).toBeTruthy();
    unmountModal();
  });

  it('check the state of the modal after close with time out and reopen it', () => {
    const modal = renderModal({
      isOpen: true,
      closeTimeoutMS: 2000,
      onRequestClose () {}
    });
    modal.portal.closeWithTimeout();
    modal.portal.open();
    modal.portal.closeWithoutTimeout();
    expect(!modal.portal.state.isOpen).toBeTruthy();
    unmountModal();
  });

  it('should close on Esc key event', () => {
    const requestCloseCallback = sinon.spy();
    const modal = renderModal({
      isOpen: true,
      shouldCloseOnOverlayClick: true,
      onRequestClose: requestCloseCallback
    });
    expect(modal.props.isOpen).toEqual(true);
    expect(() => {
      Simulate.keyDown(modal.portal.content, {
        // The keyCode is all that matters, so this works
        key: 'FakeKeyToTestLater',
        keyCode: 27,
        which: 27
      });
    }).toNotThrow();
    expect(requestCloseCallback.called).toBeTruthy();
    // Check if event is passed to onRequestClose callback.
    const event = requestCloseCallback.getCall(0).args[0];
    expect(event).toBeTruthy();
    expect(event.constructor).toBeTruthy();
    expect(event.key).toEqual('FakeKeyToTestLater');
  });

  describe('should close on overlay click', () => {
    afterEach('Unmount modal', () => {
      unmountModal();
    });

    describe('verify props', () => {
      it('verify default prop of shouldCloseOnOverlayClick', () => {
        const modal = renderModal({ isOpen: true });
        expect(modal.props.shouldCloseOnOverlayClick).toEqual(true);
      });

      it('verify prop of shouldCloseOnOverlayClick', () => {
        const modal = renderModal({ isOpen: true, shouldCloseOnOverlayClick: false });
        expect(modal.props.shouldCloseOnOverlayClick).toEqual(false);
      });
    });

    describe('verify clicks', () => {
      it('verify overlay click when shouldCloseOnOverlayClick sets to false', () => {
        const requestCloseCallback = sinon.spy();
        const modal = renderModal({
          isOpen: true,
          shouldCloseOnOverlayClick: false
        });
        expect(modal.props.isOpen).toEqual(true);
        const overlay = TestUtils.scryRenderedDOMComponentsWithClass(modal.portal, 'ReactModal__Overlay');
        expect(overlay.length).toEqual(1);
        Simulate.mouseDown(overlay[0]); // click the overlay
        Simulate.mouseUp(overlay[0]);
        expect(!requestCloseCallback.called).toBeTruthy();
      });

      it('verify overlay click when shouldCloseOnOverlayClick sets to true', () => {
        const requestCloseCallback = sinon.spy();
        const modal = renderModal({
          isOpen: true,
          shouldCloseOnOverlayClick: true,
          onRequestClose () {
            requestCloseCallback();
          }
        });
        expect(modal.props.isOpen).toEqual(true);
        const overlay = TestUtils.scryRenderedDOMComponentsWithClass(modal.portal, 'ReactModal__Overlay');
        expect(overlay.length).toEqual(1);
        Simulate.mouseDown(overlay[0]); // click the overlay
        Simulate.mouseUp(overlay[0]);
        expect(requestCloseCallback.called).toBeTruthy();
      });

      it('verify overlay mouse down and content mouse up when shouldCloseOnOverlayClick sets to true', () => {
        const requestCloseCallback = sinon.spy();
        const modal = renderModal({
          isOpen: true,
          shouldCloseOnOverlayClick: true,
          onRequestClose () {
            requestCloseCallback();
          }
        });
        expect(modal.props.isOpen).toEqual(true);
        const overlay = TestUtils.scryRenderedDOMComponentsWithClass(modal.portal, 'ReactModal__Overlay');
        const content = TestUtils.scryRenderedDOMComponentsWithClass(modal.portal, 'ReactModal__Content');
        expect(overlay.length).toEqual(1);
        expect(content.length).toEqual(1);
        Simulate.mouseDown(overlay[0]); // click the overlay
        Simulate.mouseUp(content[0]);
        expect(!requestCloseCallback.called).toBeTruthy();
      });

      it('verify content mouse down and overlay mouse up when shouldCloseOnOverlayClick sets to true', () => {
        const requestCloseCallback = sinon.spy();
        const modal = renderModal({
          isOpen: true,
          shouldCloseOnOverlayClick: true,
          onRequestClose () {
            requestCloseCallback();
          }
        });
        expect(modal.props.isOpen).toEqual(true);
        const overlay = TestUtils.scryRenderedDOMComponentsWithClass(modal.portal, 'ReactModal__Overlay');
        const content = TestUtils.scryRenderedDOMComponentsWithClass(modal.portal, 'ReactModal__Content');
        expect(content.length).toEqual(1);
        expect(overlay.length).toEqual(1);
        Simulate.mouseDown(content[0]); // click the overlay
        Simulate.mouseUp(overlay[0]);
        expect(!requestCloseCallback.called).toBeTruthy();
      });

      it('should not stop event propagation', () => {
        let hasPropagated = false;
        const modal = renderModal({
          isOpen: true,
          shouldCloseOnOverlayClick: true
        });
        const overlay = TestUtils.scryRenderedDOMComponentsWithClass(modal.portal, 'ReactModal__Overlay');
        window.addEventListener('click', () => { hasPropagated = true; });
        // Work around for running the spec in IE 11
        let mouseEvent = null;
        try {
          mouseEvent = new MouseEvent('click', { bubbles: true });
        } catch (err) {
          mouseEvent = document.createEvent('MouseEvent');
          mouseEvent.initEvent('click', true, false);
        }
        overlay[0].dispatchEvent(mouseEvent);
        expect(hasPropagated).toBeTruthy();
      });
    });

    it('verify event passing on overlay click', () => {
      const requestCloseCallback = sinon.spy();
      const modal = renderModal({
        isOpen: true,
        shouldCloseOnOverlayClick: true,
        onRequestClose: requestCloseCallback
      });
      expect(modal.props.isOpen).toEqual(true);
      const overlay = TestUtils.scryRenderedDOMComponentsWithClass(modal.portal, 'ReactModal__Overlay');
      expect(overlay.length).toEqual(1);
      // click the overlay
      Simulate.mouseDown(overlay[0]);
      Simulate.mouseUp(overlay[0], {
        // Used to test that this was the event received
        fakeData: 'ABC'
      });
      expect(requestCloseCallback.called).toBeTruthy();
      // Check if event is passed to onRequestClose callback.
      const event = requestCloseCallback.getCall(0).args[0];
      expect(event).toBeTruthy();
      expect(event.constructor).toBeTruthy();
      expect(event.fakeData).toEqual('ABC');
    });
  });

  // it('adds --before-close for animations', function() {
    // var node = document.createElement('div');

    // var component = ReactDOM.render(React.createElement(Modal, {
      // isOpen: true,
      // ariaHideApp: false,
      // closeTimeoutMS: 50,
    // }), node);

    // component = ReactDOM.render(React.createElement(Modal, {
      // isOpen: false,
      // ariaHideApp: false,
      // closeTimeoutMS: 50,
    // }), node);

    // It can't find these nodes, I didn't spend much time on this
    // var overlay = document.querySelector('.ReactModal__Overlay');
    // var content = document.querySelector('.ReactModal__Content');
    // ok(overlay.className.match(/ReactModal__Overlay--before-close/));
    // ok(content.className.match(/ReactModal__Content--before-close/));
    // unmountModal();
  // });
});
