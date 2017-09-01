/* eslint-env mocha */
import expect from 'expect';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import Modal from '../src/components/Modal';
import * as ariaAppHider from '../src/helpers/ariaAppHider';
import {
  isBodyWithReactModalOpenClass,
  contentAttribute,
  mcontent, moverlay,
  escKeyDown,
  renderModal, unmountModal, emptyDOM
} from './helper';

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
    const modal = renderModal({}, 'hello');
    expect(ReactDOM.findDOMNode(mcontent(modal))).toNotExist();
  });

  it('doesn\'t render the portal if modal is closed', () => {
    const modal = renderModal({}, 'hello');
    expect(ReactDOM.findDOMNode(modal.portal)).toNotExist();
  })

  it('has default props', () => {
    const node = document.createElement('div');
    Modal.setAppElement(document.createElement('div'));
    const modal = ReactDOM.render(<Modal />, node);
    const props = modal.props;
    expect(props.isOpen).toBe(false);
    expect(props.ariaHideApp).toBe(true);
    expect(props.closeTimeoutMS).toBe(0);
    expect(props.shouldFocusAfterRender).toBe(true);
    expect(props.shouldCloseOnOverlayClick).toBe(true);
    ReactDOM.unmountComponentAtNode(node);
    ariaAppHider.resetForTesting();
    Modal.setAppElement(document.body);  // restore default
  });

  it('accepts appElement as a prop', () => {
    const el = document.createElement('div');
    const node = document.createElement('div');
    ReactDOM.render((
      <Modal isOpen={true} appElement={el} />
    ), node);
    expect(el.getAttribute('aria-hidden')).toEqual('true');
    ReactDOM.unmountComponentAtNode(node);
  });

  it('renders into the body, not in context', () => {
    const node = document.createElement('div');
    class App extends Component {
      render() {
        return (
          <div>
            <Modal isOpen>
              <span>hello</span>
            </Modal>
          </div>
        );
      }
    }
    Modal.setAppElement(node);
    ReactDOM.render(<App />, node);
    expect(
      document.body.querySelector('.ReactModalPortal').parentNode
    ).toEqual(
      document.body
    );
    ReactDOM.unmountComponentAtNode(node);
  });

  it ('default parentSelector should be document.body.', () => {
    const modal = renderModal({ isOpen: true });
    expect(modal.props.parentSelector()).toEqual(document.body);
  });

  it('renders the modal content with a dialog aria role when provided ', () => {
    const child = 'I am a child of Modal, and he has sent me here...';
    const modal = renderModal({ isOpen: true, role: 'dialog' }, child);
    expect(contentAttribute(modal, 'role')).toEqual('dialog');
  });

  it('set aria-label based on the contentLabel prop', () => {
    const child = 'I am a child of Modal, and he has sent me here...';
    const modal = renderModal({
      isOpen: true,
      contentLabel: 'Special Modal'
    }, child);
    expect(
      contentAttribute(modal, 'aria-label')
    ).toEqual('Special Modal');
  });

  it('removes the portal node', () => {
    const modal = renderModal({ isOpen: true }, 'hello');
    unmountModal();
    expect(document.querySelector('.ReactModalPortal')).toNotExist();
  });

  it('removes the portal node after closeTimeoutMS', done => {
    const closeTimeoutMS = 100;
    renderModal({ isOpen: true, closeTimeoutMS }, 'hello');

    function checkDOM(count) {
      const portal = document.querySelectorAll('.ReactModalPortal');
      expect(portal.length).toBe(count);
    }

    unmountModal();

    // content is still mounted after modal is gone
    checkDOM(1);

    setTimeout(() => {
      // content is unmounted after specified timeout
      checkDOM(0);
      done();
    }, closeTimeoutMS);
  });

  it('focuses the modal content by default', () => {
    const modal = renderModal({ isOpen: true }, null);
    expect(document.activeElement).toBe(mcontent(modal));
  });

  it('does not focus the modal content when shouldFocusAfterRender is false', () => {
    const modal = renderModal({ isOpen: true, shouldFocusAfterRender: false }, null);
    expect(document.activeElement).toNotBe(mcontent(modal));
  });

  it('give back focus to previous element or modal.', done => {
    function cleanup () {
      unmountModal();
      done();
    }
    const modalA = renderModal({
      isOpen: true,
      className: 'modal-a',
      onRequestClose: cleanup
    }, null);

    const modalContent = mcontent(modalA);
    expect(document.activeElement).toEqual(modalContent);

    const modalB = renderModal({
      isOpen: true,
      className: 'modal-b',
      onRequestClose() {
        const modalContent = mcontent(modalB);
        expect(document.activeElement).toEqual(mcontent(modalA));
        escKeyDown(modalContent);
        expect(document.activeElement).toEqual(modalContent);
      }
    }, null);

    escKeyDown(modalContent);
  });

  it('does not steel focus when a descendent is already focused', () => {
    let content;
    const input = (
      <input ref={(el) => { el && el.focus(); content = el; }} />
    );
    renderModal({ isOpen: true }, input, () => {
      expect(document.activeElement).toEqual(content);
    });
  });

  it('supports portalClassName', () => {
    const modal = renderModal({
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

  it('overrides content classes with custom object className', () => {
    const modal = renderModal({
      isOpen: true,
      className: {
        base: 'myClass',
        afterOpen: 'myClass_after-open',
        beforeClose: 'myClass_before-close'
      }
    });
    expect(
      mcontent(modal).className
    ).toEqual(
      'myClass myClass_after-open'
    );
    unmountModal();
  });

  it('overrides overlay classes with custom object overlayClassName', () => {
    const modal = renderModal({
      isOpen: true,
      overlayClassName: {
        base: 'myOverlayClass',
        afterOpen: 'myOverlayClass_after-open',
        beforeClose: 'myOverlayClass_before-close'
      }
    });
    expect(
      moverlay(modal).className
    ).toEqual(
      'myOverlayClass myOverlayClass_after-open'
    );
    unmountModal();
  });

  it('supports overriding react modal open class in document.body.', () => {
    const modal = renderModal({
      isOpen: true,
      bodyOpenClassName: 'custom-modal-open'
    });
    expect(
      document.body.className.indexOf('custom-modal-open') > -1
    ).toBeTruthy();
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

  it('supports adding/removing multiple document.body classes', () => {
    renderModal({
      isOpen: true,
      bodyOpenClassName: 'A B C'
    });
    expect(document.body.classList.contains('A', 'B', 'C')).toBeTruthy();
    unmountModal();
    expect(!document.body.classList.contains('A', 'B', 'C')).toBeTruthy();
  });

  it('does not remove shared classes if more than one modal is open', () => {
    renderModal({
      isOpen: true,
      bodyOpenClassName: 'A'
    });
    renderModal({
      isOpen: true,
      bodyOpenClassName: 'A B'
    });

    expect(isBodyWithReactModalOpenClass('A B')).toBeTruthy();
    unmountModal();
    expect(!isBodyWithReactModalOpenClass('A B')).toBeTruthy();
    expect(isBodyWithReactModalOpenClass('A')).toBeTruthy();
    unmountModal();
    expect(!isBodyWithReactModalOpenClass('A')).toBeTruthy();
  });

  it('should not add classes to document.body for unopened modals', () => {
    renderModal({ isOpen: true });
    expect(isBodyWithReactModalOpenClass()).toBeTruthy();
    renderModal({ isOpen: false, bodyOpenClassName: 'testBodyClass' });
    expect(!isBodyWithReactModalOpenClass('testBodyClass')).toBeTruthy()
  });

  it('should not remove classes from document.body when rendering unopened modal', () => {
    renderModal({ isOpen: true });
    expect(isBodyWithReactModalOpenClass()).toBeTruthy();
    renderModal({ isOpen: false, bodyOpenClassName: 'testBodyClass' });
    renderModal({ isOpen: false });
    expect(!isBodyWithReactModalOpenClass('testBodyClass')).toBeTruthy()
    expect(isBodyWithReactModalOpenClass()).toBeTruthy();
    renderModal({ isOpen: false });
    renderModal({ isOpen: false });
    expect(isBodyWithReactModalOpenClass()).toBeTruthy();
  });

  it('additional aria attributes', () => {
    const modal = renderModal({ isOpen: true, aria: { labelledby: "a" }}, 'hello');
    expect(
      mcontent(modal).getAttribute('aria-labelledby')
    ).toEqual("a");
    unmountModal();
  });

  it('adding/removing aria-hidden without an appElement will try to fallback to document.body', () => {
    ariaAppHider.documentNotReadyOrSSRTesting();
    const node = document.createElement('div');
    ReactDOM.render((
      <Modal isOpen />
    ), node);
    expect(document.body.getAttribute('aria-hidden')).toEqual('true');
    ReactDOM.unmountComponentAtNode(node);
    expect(document.body.getAttribute('aria-hidden')).toEqual(null);
  });

  it('raise an exception if appElement is a selector and no elements were found.', () => {
    expect(() => ariaAppHider.setElement('.test')).toThrow();
  });

  it('removes aria-hidden from appElement when unmounted w/o closing', () => {
    const el = document.createElement('div');
    const node = document.createElement('div');
    ReactDOM.render((
      <Modal isOpen appElement={el} />
    ), node);
    expect(el.getAttribute('aria-hidden')).toEqual('true');
    ReactDOM.unmountComponentAtNode(node);
    expect(el.getAttribute('aria-hidden')).toEqual(null);
  });

  it('adds --after-open for animations', () => {
    const modal = renderModal({ isOpen: true });
    const rg = /--after-open/i;
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

  it('should not be open after close with time out and reopen it', () => {
    const modal = renderModal({
      isOpen: true,
      closeTimeoutMS: 2000,
      onRequestClose() {}
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
    const modalOpts = { isOpen: true, shouldCloseOnOverlayClick: false };
    const modal = renderModal(modalOpts);
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

  it('shouldn\'t throw if forcibly unmounted during mounting', () => {
    /* eslint-disable camelcase, react/prop-types */
    class Wrapper extends Component {
      constructor (props) {
        super(props);
        this.state = { error: false };
      }
      unstable_handleError () {
        this.setState({ error: true });
      }
      render () {
        return this.state.error ? null : <div>{ this.props.children }</div>;
      }
    }
    /* eslint-enable camelcase, react/prop-types */

    const Throw = () => { throw new Error('reason'); };
    const TestCase = () => (
      <Wrapper>
        <Modal />
        <Throw />
      </Wrapper>
    );

    const currentDiv = document.createElement('div');
    document.body.appendChild(currentDiv);

    const mount = () => ReactDOM.render(<TestCase />, currentDiv);
    expect(mount).toNotThrow();

    document.body.removeChild(currentDiv);
  });

  it('verify that portalClassName is refreshed on component update', () => {
    const node = document.createElement('div');
    let modal = null;

    class App extends Component {
      constructor(props) {
        super(props);
        this.state = { testHasChanged: false };
      }

      componentDidMount() {
        expect(modal.node.className).toEqual('myPortalClass');

        this.setState({
          testHasChanged: true
        });
      }

      componentDidUpdate() {
        expect(modal.node.className).toEqual('myPortalClass-modifier');
      }

      render() {
        const portalClassName = this.state.testHasChanged === true ?
          'myPortalClass-modifier' : 'myPortalClass';

        return (
          <div>
            <Modal
              ref={modalComponent => { modal = modalComponent; }}
              isOpen
              portalClassName={portalClassName}>
              <span>Test</span>
            </Modal>
          </div>
        );
      }
    }

    Modal.setAppElement(node);
    ReactDOM.render(<App />, node);
  });
});
