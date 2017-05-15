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
import Modal from '../src/components/Modal';
import { renderModal, unmountModal, emptyDOM } from './helper';

const Simulate = TestUtils.Simulate;

function getDefaultProps () {
  return {
    getAppElement () {},
    contentLabel: 'Test Modal',
    isOpen: true
  };
}


describe('Modal', () => {
  afterEach('check if test cleaned up rendered modals', emptyDOM);

  it('scopes tab navigation to the modal');
  it('focuses the last focused element when tabbing in from browser chrome');

  it('can be open initially', () => {
    const component = renderModal(getDefaultProps(), 'hello');
    expect(component.portal.content.innerHTML.trim()).toEqual('hello');
  });

  it('can be closed initially', () => {
    const props = {
      ...getDefaultProps(),
      isOpen: false
    };
    const component = renderModal(props, 'hello');
    expect(ReactDOM.findDOMNode(component.portal).innerHTML.trim()).toEqual('');
  });

  it('renders into the body, not in context', () => {
    const node = document.createElement('div');
    const App = () => (
      <div>
        <Modal {...getDefaultProps()} getAppElement={() => node}>
          hello
        </Modal>
      </div>
    );
    ReactDOM.render(<App />, node);
    const modalParent = document.body.querySelector('.ReactModalPortal').parentNode;
    expect(modalParent).toEqual(document.body);
    ReactDOM.unmountComponentAtNode(node);
  });

  it('renders children', () => {
    const child = 'I am a child of Modal, and he has sent me here...';
    const component = renderModal(getDefaultProps(), child);
    expect(component.portal.content.innerHTML).toEqual(child);
  });

  it('renders the modal content with a dialog aria role when provided ', () => {
    const child = 'I am a child of Modal, and he has sent me here...';
    const component = renderModal({ ...getDefaultProps(), role: 'dialog' }, child);
    expect(component.portal.content.getAttribute('role')).toEqual('dialog');
  });

  it('renders the modal with a aria-label based on the contentLabel prop', () => {
    const child = 'I am a child of Modal, and he has sent me here...';
    const component = renderModal(getDefaultProps(), child);
    expect(component.portal.content.getAttribute('aria-label')).toEqual('Test Modal');
  });

  it('has default props', () => {
    const testProps = getDefaultProps();
    const node = document.createElement('div');
    testProps.getAppElement = () => document.createElement('div');
    const component = ReactDOM.render(<Modal {...testProps} />, node);
    const props = component.props;
    expect(props.ariaHideApp).toBe(true);
    expect(props.closeTimeoutMS).toBe(0);
    expect(props.shouldCloseOnOverlayClick).toBe(true);
    expect(props.shouldCloseOnEsc).toBe(true);
    ReactDOM.unmountComponentAtNode(node);
  });

  it('removes the portal node', () => {
    const component = renderModal(getDefaultProps(), 'hello');
    expect(component.portal.content.innerHTML.trim()).toEqual('hello');
    unmountModal();
    expect(!document.querySelector('.ReactModalPortal')).toExist();
  });

  it('focuses the modal content', () => {
    renderModal(getDefaultProps(), null, function checkModalContentFocus () {
      expect(document.activeElement).toEqual(this.portal.content);
    });
  });

  it('give back focus to previous element or modal.', (done) => {
    const testProps = getDefaultProps();
    testProps.onRequestClose = () => done();
    const modal = renderModal(testProps, null, () => {});
    const testProps2 = getDefaultProps();
    testProps2.onRequestClose = () => {
      Simulate.keyDown(modal.portal.content, {
        // The keyCode is all that matters, so this works
        key: 'FakeKeyToTestLater',
        keyCode: 27,
        which: 27
      });
      expect(document.activeElement).toEqual(modal.portal.content);
    };
    renderModal(testProps2, null, function checkPortalFocus () {
      expect(document.activeElement).toEqual(this.portal.content);
      Simulate.keyDown(this.portal.content, {
        // The keyCode is all that matters, so this works
        key: 'FakeKeyToTestLater',
        keyCode: 27,
        which: 27
      });
    });
  });

  it('does not focus the modal content when a descendent is already focused', () => {
    const input = (
      <input
        className="focus_input"
        ref={el => (el && el.focus())}
      />
    );

    renderModal(getDefaultProps(), input, () => {
      expect(document.activeElement).toEqual(document.querySelector('.focus_input'));
    });
  });

  it('handles case when child has no tabbable elements', () => {
    const component = renderModal(getDefaultProps(), 'hello');
    expect(() => {
      Simulate.keyDown(component.portal.content, { key: 'Tab', keyCode: 9, which: 9 });
    }).toNotThrow();
  });

  it('keeps focus inside the modal when child has no tabbable elements', () => {
    let tabPrevented = false;
    const modal = renderModal(getDefaultProps(), 'hello');
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
    const modal = renderModal({ ...getDefaultProps(), portalClassName: 'myPortalClass' });
    expect(modal.node.className).toEqual('myPortalClass');
  });

  it('supports custom className', () => {
    const modal = renderModal({ ...getDefaultProps(), className: 'myClass' });
    expect(modal.portal.content.className.indexOf('myClass')).toNotEqual(-1);
  });

  it('supports overlayClassName', () => {
    const modal = renderModal({ ...getDefaultProps(), overlayClassName: 'myOverlayClass' });
    expect(modal.portal.overlay.className.indexOf('myOverlayClass')).toNotEqual(-1);
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
    expect(modal.portal.content.className).toEqual('myClass myClass_after-open');
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
    expect(modal.portal.overlay.className).toEqual('myOverlayClass myOverlayClass_after-open');
    unmountModal();
  });

  it('overrides the default styles when a custom classname is used', () => {
    const modal = renderModal({ ...getDefaultProps(), className: 'myClass' });
    expect(modal.portal.content.style.top).toEqual('');
  });

  it('overrides the default styles when a custom overlayClassName is used', () => {
    const modal = renderModal({ ...getDefaultProps(), overlayClassName: 'myOverlayClass' });
    expect(modal.portal.overlay.style.backgroundColor).toEqual('');
  });

  it('supports adding style to the modal contents', () => {
    const modal = renderModal({ ...getDefaultProps(), style: { content: { width: '20px' } } });
    expect(modal.portal.content.style.width).toEqual('20px');
  });

  it('supports overriding style on the modal contents', () => {
    const modal = renderModal({ ...getDefaultProps(), style: { content: { position: 'static' } } });
    expect(modal.portal.content.style.position).toEqual('static');
  });

  it('supports adding style on the modal overlay', () => {
    const modal = renderModal({ ...getDefaultProps(), style: { overlay: { width: '75px' } } });
    expect(modal.portal.overlay.style.width).toEqual('75px');
  });

  it('supports overriding style on the modal overlay', () => {
    const modal = renderModal({ ...getDefaultProps(), style: { overlay: { position: 'static' } } });
    expect(modal.portal.overlay.style.position).toEqual('static');
  });

  it('supports overriding the default styles', () => {
    const previousStyle = Modal.defaultStyles.content.position;
    // Just in case the default style is already relative, check that we can change it
    const newStyle = previousStyle === 'relative' ? 'static' : 'relative';
    Modal.defaultStyles.content.position = newStyle;
    const modal = renderModal(getDefaultProps());
    expect(modal.portal.content.style.position).toEqual(newStyle);
    Modal.defaultStyles.content.position = previousStyle;
  });

  it('adds class to body when open', () => {
    const testProps = { ...getDefaultProps(), isOpen: false };
    renderModal(testProps);
    expect(document.body.className.indexOf('ReactModal__Body--open') !== -1).toEqual(false);
    unmountModal();

    renderModal(getDefaultProps());
    expect(document.body.className.indexOf('ReactModal__Body--open') !== -1).toEqual(true);
    unmountModal();

    renderModal(testProps);
    expect(document.body.className.indexOf('ReactModal__Body--open') !== -1).toEqual(false);
  });

  it('removes class from body when unmounted without closing', () => {
    renderModal(getDefaultProps());
    expect(document.body.className.indexOf('ReactModal__Body--open') !== -1).toEqual(true);
    unmountModal();
    expect(document.body.className.indexOf('ReactModal__Body--open') !== -1).toEqual(false);
  });

  it('sets aria-hidden to false on appElement when unmounted without closing', () => {
    const el = document.createElement('div');
    const node = document.createElement('div');
    ReactDOM.render(React.createElement(Modal, {
      ...getDefaultProps(),
      getAppElement () { return el; }
    }), node);
    expect(el.getAttribute('aria-hidden')).toEqual('true');
    ReactDOM.unmountComponentAtNode(node);
    expect(el.getAttribute('aria-hidden')).toEqual('false');
  });

  it('adds --after-open for animations', () => {
    renderModal(getDefaultProps());
    const overlay = document.querySelector('.ReactModal__Overlay');
    const content = document.querySelector('.ReactModal__Content');
    expect(overlay.className.match(/ReactModal__Overlay--after-open/)).toExist();
    expect(content.className.match(/ReactModal__Content--after-open/)).toExist();
  });

  it('should trigger the onAfterOpen callback', () => {
    const afterOpenCallback = sinon.spy();
    renderModal({
      ...getDefaultProps(),
      onAfterOpen: afterOpenCallback
    });
    expect(afterOpenCallback.called).toBeTruthy();
  });

  it('check the state of the modal after close with time out and reopen it', () => {
    const modal = renderModal({
      ...getDefaultProps(),
      closeTimeoutMS: 2000,
      onRequestClose () {}
    });
    modal.portal.closeWithTimeout();
    modal.portal.open();
    modal.portal.closeWithoutTimeout();
    expect(!modal.portal.state.isOpen).toBeTruthy();
  });

  it('should close on Esc key event', () => {
    const requestCloseCallback = sinon.spy();
    const modal = renderModal({
      ...getDefaultProps(),
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

  it('should not close on Esc key event when flagged not to', () => {
    const requestCloseCallback = sinon.spy();
    const modal = renderModal({
      ...getDefaultProps(),
      shouldCloseOnOverlayClick: true,
      shouldCloseOnEsc: false,
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
    expect(!requestCloseCallback.called).toBeTruthy();
  });

  describe('Show/Hide appElement', () => {
    let elementArray;
    let node;
    beforeEach(() => {
      const el = document.createElement('div');
      const el2 = document.createElement('div');
      const el3 = document.createElement('div');
      elementArray = [el, el2, el3];
      node = document.createElement('div');
    });

    it('hides an array of appElements', () => {
      ReactDOM.render(
        <Modal
          {...getDefaultProps()}
          getAppElement={() => elementArray}
        />
      , node);
      const values = elementArray.map(ae => ae.getAttribute('aria-hidden'));
      expect(values).toEqual(['true', 'true', 'true']);
      ReactDOM.unmountComponentAtNode(node);
    });

    it('shows an array of appElements', () => {
      ReactDOM.render(
        <Modal
          {...getDefaultProps()}
          getAppElement={() => elementArray}
        />
      , node);
      ReactDOM.unmountComponentAtNode(node);
      const values = elementArray.map(ae => ae.getAttribute('aria-hidden'));
      expect(values).toEqual(['false', 'false', 'false']);
    });

    it('hides a single appElement', () => {
      ReactDOM.render(
        <Modal
          {...getDefaultProps()}
          getAppElement={() => elementArray[0]}
        />
      , node);
      expect(elementArray[0].getAttribute('aria-hidden')).toEqual('true');
      ReactDOM.unmountComponentAtNode(node);
    });

    it('shows a single appElement', () => {
      ReactDOM.render(
        <Modal
          {...getDefaultProps()}
          getAppElement={() => elementArray[0]}
        />
      , node);
      ReactDOM.unmountComponentAtNode(node);
      expect(elementArray[0].getAttribute('aria-hidden')).toEqual('false');
    });

    it('throws an error if appElement is not provided', () => {
      function renderError () {
        ReactDOM.render(
          <Modal
            {...getDefaultProps()}
          />
        , node);
      }
      expect(renderError).toThrow('react-modal: Setting an getAppElement function is required');
    });
  });

  describe('should close on overlay click', () => {
    afterEach('Unmount modal', emptyDOM);

    describe('verify props', () => {
      afterEach('Unmount modal', emptyDOM);

      it('verify default prop of shouldCloseOnOverlayClick', () => {
        const modal = renderModal(getDefaultProps());
        expect(modal.props.shouldCloseOnOverlayClick).toEqual(true);
      });

      it('verify prop of shouldCloseOnOverlayClick', () => {
        const modal = renderModal({ ...getDefaultProps(), shouldCloseOnOverlayClick: false });
        expect(modal.props.shouldCloseOnOverlayClick).toEqual(false);
      });
    });

    describe('verify clicks', () => {
      afterEach('Unmount modal', emptyDOM);

      it('verify overlay click when shouldCloseOnOverlayClick sets to false', () => {
        const requestCloseCallback = sinon.spy();
        const modal = renderModal({
          ...getDefaultProps(),
          shouldCloseOnOverlayClick: false
        });
        expect(modal.props.isOpen).toEqual(true);
        const overlay = TestUtils.scryRenderedDOMComponentsWithClass(modal.portal, 'ReactModal__Overlay');
        expect(overlay.length).toEqual(1);
        Simulate.click(overlay[0]); // click the overlay
        expect(!requestCloseCallback.called).toBeTruthy();
      });

      it('verify overlay click when shouldCloseOnOverlayClick sets to true', () => {
        const requestCloseCallback = sinon.spy();
        const modal = renderModal({
          ...getDefaultProps(),
          shouldCloseOnOverlayClick: true,
          onRequestClose () {
            requestCloseCallback();
          }
        });
        expect(modal.props.isOpen).toEqual(true);
        const overlay = TestUtils.scryRenderedDOMComponentsWithClass(modal.portal, 'ReactModal__Overlay');
        expect(overlay.length).toEqual(1);
        Simulate.click(overlay[0]); // click the overlay
        expect(requestCloseCallback.called).toBeTruthy();
      });

      it('verify overlay mouse down and content mouse up when shouldCloseOnOverlayClick sets to true', () => {
        const requestCloseCallback = sinon.spy();
        const modal = renderModal({
          ...getDefaultProps(),
          shouldCloseOnOverlayClick: true,
          onRequestClose: requestCloseCallback
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
          ...getDefaultProps(),
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
          ...getDefaultProps(),
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
        ...getDefaultProps(),
        shouldCloseOnOverlayClick: true,
        onRequestClose: requestCloseCallback
      });
      expect(modal.props.isOpen).toEqual(true);
      const overlay = TestUtils.scryRenderedDOMComponentsWithClass(modal.portal, 'ReactModal__Overlay');
      expect(overlay.length).toEqual(1);
      // click the overlay
      Simulate.click(overlay[0], {
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

  it('adds --before-close for animations', () => {
    const closeTimeoutMS = 50;
    const modal = renderModal({
      ...getDefaultProps(),
      closeTimeoutMS
    });

    modal.portal.closeWithTimeout();
    unmountModal();

    const overlay = TestUtils.findRenderedDOMComponentWithClass(modal.portal, 'ReactModal__Overlay');
    const content = TestUtils.findRenderedDOMComponentWithClass(modal.portal, 'ReactModal__Content');

    expect(/ReactModal__Overlay--before-close/.test(overlay.className)).toBe(true);
    expect(/ReactModal__Content--before-close/.test(content.className)).toBe(true);

    modal.portal.closeWithoutTimeout();
  });

  it('keeps the modal in the DOM until closeTimeoutMS elapses', (done) => {
    const closeTimeoutMS = 50;

    renderModal({
      ...getDefaultProps(),
      closeTimeoutMS
    });

    unmountModal();

    const checkDOM = (expectMounted) => {
      const overlay = document.querySelectorAll('.ReactModal__Overlay');
      const content = document.querySelectorAll('.ReactModal__Content');
      const numNodes = expectMounted ? 1 : 0;
      expect(overlay.length).toBe(numNodes);
      expect(content.length).toBe(numNodes);
    };

    // content is still mounted after modal is gone
    checkDOM(true);

    setTimeout(() => {
      // content is unmounted after specified timeout
      checkDOM(false);
      done();
    }, closeTimeoutMS);
  });
});
