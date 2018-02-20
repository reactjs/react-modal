/* eslint-env mocha */
import should from "should";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import * as ariaAppHider from "react-modal/helpers/ariaAppHider";
import {
  isBodyWithReactModalOpenClass,
  isHtmlWithReactModalOpenClass,
  htmlClassList,
  contentAttribute,
  mcontent,
  moverlay,
  escKeyDown,
  renderModal,
  unmountModal,
  emptyDOM
} from "./helper";

export default () => {
  afterEach("cleaned up all rendered modals", emptyDOM);

  it("scopes tab navigation to the modal");
  it("focuses the last focused element when tabbing in from browser chrome");
  it("renders children [tested indirectly]");

  it("can be open initially", () => {
    const modal = renderModal({ isOpen: true }, "hello");
    mcontent(modal).should.be.ok();
  });

  it("can be closed initially", () => {
    const modal = renderModal({}, "hello");
    should(ReactDOM.findDOMNode(mcontent(modal))).not.be.ok();
  });

  it("doesn't render the portal if modal is closed", () => {
    const modal = renderModal({}, "hello");
    should(ReactDOM.findDOMNode(modal.portal)).not.be.ok();
  });

  it("has default props", () => {
    const node = document.createElement("div");
    Modal.setAppElement(document.createElement("div"));
    // eslint-disable-next-line react/no-render-return-value
    const modal = ReactDOM.render(<Modal />, node);
    const props = modal.props;
    props.isOpen.should.not.be.ok();
    props.ariaHideApp.should.be.ok();
    props.closeTimeoutMS.should.be.eql(0);
    props.shouldFocusAfterRender.should.be.ok();
    props.shouldCloseOnOverlayClick.should.be.ok();
    ReactDOM.unmountComponentAtNode(node);
    ariaAppHider.resetForTesting();
    Modal.setAppElement(document.body); // restore default
  });

  it("accepts appElement as a prop", () => {
    const el = document.createElement("div");
    const node = document.createElement("div");
    ReactDOM.render(<Modal isOpen={true} appElement={el} />, node);
    el.getAttribute("aria-hidden").should.be.eql("true");
    ReactDOM.unmountComponentAtNode(node);
  });

  it("renders into the body, not in context", () => {
    const node = document.createElement("div");
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
    document.body
      .querySelector(".ReactModalPortal")
      .parentNode.should.be.eql(document.body);
    ReactDOM.unmountComponentAtNode(node);
  });

  it("default parentSelector should be document.body.", () => {
    const modal = renderModal({ isOpen: true });
    modal.props.parentSelector().should.be.eql(document.body);
  });

  it("renders the modal content with a dialog aria role when provided ", () => {
    const child = "I am a child of Modal, and he has sent me here...";
    const modal = renderModal({ isOpen: true, role: "dialog" }, child);
    contentAttribute(modal, "role").should.be.eql("dialog");
  });

  it("sets aria-label based on the contentLabel prop", () => {
    const child = "I am a child of Modal, and he has sent me here...";
    const modal = renderModal(
      {
        isOpen: true,
        contentLabel: "Special Modal"
      },
      child
    );

    contentAttribute(modal, "aria-label").should.be.eql("Special Modal");
  });

  it("removes the portal node", () => {
    renderModal({ isOpen: true }, "hello");
    unmountModal();
    should(document.querySelector(".ReactModalPortal")).not.be.ok();
  });

  it("removes the portal node after closeTimeoutMS", done => {
    const closeTimeoutMS = 100;
    renderModal({ isOpen: true, closeTimeoutMS }, "hello");

    function checkDOM(count) {
      const portal = document.querySelectorAll(".ReactModalPortal");
      portal.length.should.be.eql(count);
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

  it("focuses the modal content by default", () => {
    const modal = renderModal({ isOpen: true }, null);
    document.activeElement.should.be.eql(mcontent(modal));
  });

  it("does not focus modal content if shouldFocusAfterRender is false", () => {
    const modal = renderModal(
      { isOpen: true, shouldFocusAfterRender: false },
      null
    );
    document.activeElement.should.not.be.eql(mcontent(modal));
  });

  it("give back focus to previous element or modal.", done => {
    function cleanup() {
      unmountModal();
      done();
    }
    const modalA = renderModal(
      {
        isOpen: true,
        className: "modal-a",
        onRequestClose: cleanup
      },
      null
    );

    const modalContent = mcontent(modalA);
    document.activeElement.should.be.eql(modalContent);

    const modalB = renderModal(
      {
        isOpen: true,
        className: "modal-b",
        onRequestClose() {
          const modalContent = mcontent(modalB);
          document.activeElement.should.be.eql(mcontent(modalA));
          escKeyDown(modalContent);
          document.activeElement.should.be.eql(modalContent);
        }
      },
      null
    );

    escKeyDown(modalContent);
  });

  xit("does not steel focus when a descendent is already focused", () => {
    let content;
    const input = (
      <input
        ref={el => {
          el && el.focus();
          content = el;
        }}
      />
    );
    renderModal({ isOpen: true }, input, () => {
      document.activeElement.should.be.eql(content);
    });
  });

  it("supports portalClassName", () => {
    const modal = renderModal({
      isOpen: true,
      portalClassName: "myPortalClass"
    });
    modal.node.className.includes("myPortalClass").should.be.ok();
  });

  it("supports custom className", () => {
    const modal = renderModal({ isOpen: true, className: "myClass" });
    mcontent(modal)
      .className.includes("myClass")
      .should.be.ok();
  });

  it("supports overlayClassName", () => {
    const modal = renderModal({
      isOpen: true,
      overlayClassName: "myOverlayClass"
    });
    moverlay(modal)
      .className.includes("myOverlayClass")
      .should.be.ok();
  });

  it("overrides content classes with custom object className", () => {
    const modal = renderModal({
      isOpen: true,
      className: {
        base: "myClass",
        afterOpen: "myClass_after-open",
        beforeClose: "myClass_before-close"
      }
    });
    mcontent(modal).className.should.be.eql("myClass myClass_after-open");
    unmountModal();
  });

  it("overrides overlay classes with custom object overlayClassName", () => {
    const modal = renderModal({
      isOpen: true,
      overlayClassName: {
        base: "myOverlayClass",
        afterOpen: "myOverlayClass_after-open",
        beforeClose: "myOverlayClass_before-close"
      }
    });
    moverlay(modal).className.should.be.eql(
      "myOverlayClass myOverlayClass_after-open"
    );
    unmountModal();
  });

  it("supports overriding react modal open class in document.body.", () => {
    renderModal({ isOpen: true, bodyOpenClassName: "custom-modal-open" });
    (document.body.className.indexOf("custom-modal-open") > -1).should.be.ok();
  });

  it("supports setting react modal open class in <html />.", () => {
    renderModal({ isOpen: true, htmlOpenClassName: "custom-modal-open" });
    isHtmlWithReactModalOpenClass("custom-modal-open").should.be.ok();
  });

  // eslint-disable-next-line max-len
  it("don't append class to document.body if modal is closed.", () => {
    renderModal({ isOpen: false });
    isBodyWithReactModalOpenClass().should.not.be.ok();
  });

  it("don't append class to <html /> if modal is closed.", () => {
    renderModal({ isOpen: false, htmlOpenClassName: "custom-modal-open" });
    isHtmlWithReactModalOpenClass().should.not.be.ok();
  });

  it("append class to document.body if modal is open.", () => {
    renderModal({ isOpen: true });
    isBodyWithReactModalOpenClass().should.be.ok();
  });

  it("don't append class to <html /> if not defined.", () => {
    renderModal({ isOpen: true });
    htmlClassList().should.be.empty();
  });

  // eslint-disable-next-line max-len
  it("removes class from document.body when unmounted without closing", () => {
    renderModal({ isOpen: true });
    unmountModal();
    isBodyWithReactModalOpenClass().should.not.be.ok();
  });

  it("remove class from document.body when no modals opened", () => {
    renderModal({ isOpen: true });
    renderModal({ isOpen: true });
    isBodyWithReactModalOpenClass().should.be.ok();
    unmountModal();
    isBodyWithReactModalOpenClass().should.be.ok();
    unmountModal();
    isBodyWithReactModalOpenClass().should.not.be.ok();
    isHtmlWithReactModalOpenClass().should.not.be.ok();
  });

  it("supports adding/removing multiple document.body classes", () => {
    renderModal({
      isOpen: true,
      bodyOpenClassName: "A B C"
    });
    document.body.classList.contains("A", "B", "C").should.be.ok();
    unmountModal();
    document.body.classList.contains("A", "B", "C").should.not.be.ok();
  });

  it("does not remove shared classes if more than one modal is open", () => {
    renderModal({
      isOpen: true,
      bodyOpenClassName: "A"
    });
    renderModal({
      isOpen: true,
      bodyOpenClassName: "A B"
    });

    isBodyWithReactModalOpenClass("A B").should.be.ok();
    unmountModal();
    isBodyWithReactModalOpenClass("A B").should.not.be.ok();
    isBodyWithReactModalOpenClass("A").should.be.ok();
    unmountModal();
    isBodyWithReactModalOpenClass("A").should.not.be.ok();
  });

  it("should not add classes to document.body for unopened modals", () => {
    renderModal({ isOpen: true });
    isBodyWithReactModalOpenClass().should.be.ok();
    renderModal({ isOpen: false, bodyOpenClassName: "testBodyClass" });
    isBodyWithReactModalOpenClass("testBodyClass").should.not.be.ok();
  });

  it("should not remove classes from document.body if modal is closed", () => {
    renderModal({ isOpen: true });
    isBodyWithReactModalOpenClass().should.be.ok();
    renderModal({ isOpen: false, bodyOpenClassName: "testBodyClass" });
    renderModal({ isOpen: false });
    isBodyWithReactModalOpenClass("testBodyClass").should.not.be.ok();
    isBodyWithReactModalOpenClass().should.be.ok();
    renderModal({ isOpen: false });
    renderModal({ isOpen: false });
    isBodyWithReactModalOpenClass().should.be.ok();
  });

  it("should not remove classes from <html /> if modal is closed", () => {
    const modalA = renderModal({ isOpen: false });
    isHtmlWithReactModalOpenClass().should.not.be.ok();
    const modalB = renderModal({
      isOpen: true,
      htmlOpenClassName: "testHtmlClass"
    });
    modalA.portal.close();
    isHtmlWithReactModalOpenClass("testHtmlClass").should.be.ok();
    modalB.portal.close();
    isHtmlWithReactModalOpenClass().should.not.be.ok();
    renderModal({ isOpen: false });
  });

  it("additional aria attributes", () => {
    const modal = renderModal(
      { isOpen: true, aria: { labelledby: "a" } },
      "hello"
    );
    mcontent(modal)
      .getAttribute("aria-labelledby")
      .should.be.eql("a");
    unmountModal();
  });

  it("raises an exception if the appElement selector does not match", () => {
    should(() => ariaAppHider.setElement(".test")).throw();
  });

  it("removes aria-hidden from appElement when unmounted w/o closing", () => {
    const el = document.createElement("div");
    const node = document.createElement("div");
    ReactDOM.render(<Modal isOpen appElement={el} />, node);
    el.getAttribute("aria-hidden").should.be.eql("true");
    ReactDOM.unmountComponentAtNode(node);
    should(el.getAttribute("aria-hidden")).not.be.ok();
  });

  // eslint-disable-next-line max-len
  it("removes aria-hidden when closed and another modal with ariaHideApp set to false is open", () => {
    const rootNode = document.createElement("div");
    document.body.appendChild(rootNode);

    const appElement = document.createElement("div");
    document.body.appendChild(appElement);

    Modal.setAppElement(appElement);

    const initialState = (
      <div>
        <Modal isOpen={true} ariaHideApp={false} id="test-1-modal-1" />
        <Modal isOpen={true} ariaHideApp={true} id="test-1-modal-2" />
      </div>
    );

    ReactDOM.render(initialState, rootNode);
    appElement.getAttribute("aria-hidden").should.be.eql("true");

    const updatedState = (
      <div>
        <Modal isOpen={true} ariaHideApp={false} id="test-1-modal-1" />
        <Modal isOpen={false} ariaHideApp={true} id="test-1-modal-2" />
      </div>
    );

    ReactDOM.render(updatedState, rootNode);
    should(appElement.getAttribute("aria-hidden")).not.be.ok();

    ReactDOM.unmountComponentAtNode(rootNode);
  });

  // eslint-disable-next-line max-len
  it("maintains aria-hidden when closed and another modal with ariaHideApp set to true is open", () => {
    const rootNode = document.createElement("div");
    document.body.appendChild(rootNode);

    const appElement = document.createElement("div");
    document.body.appendChild(appElement);

    Modal.setAppElement(appElement);

    const initialState = (
      <div>
        <Modal isOpen={true} ariaHideApp={true} id="test-1-modal-1" />
        <Modal isOpen={true} ariaHideApp={true} id="test-1-modal-2" />
      </div>
    );

    ReactDOM.render(initialState, rootNode);
    appElement.getAttribute("aria-hidden").should.be.eql("true");

    const updatedState = (
      <div>
        <Modal isOpen={true} ariaHideApp={true} id="test-1-modal-1" />
        <Modal isOpen={false} ariaHideApp={true} id="test-1-modal-2" />
      </div>
    );

    ReactDOM.render(updatedState, rootNode);
    appElement.getAttribute("aria-hidden").should.be.eql("true");

    ReactDOM.unmountComponentAtNode(rootNode);
  });

  // eslint-disable-next-line max-len
  it("removes aria-hidden when unmounted without close and second modal with ariaHideApp=false is open", () => {
    const appElement = document.createElement("div");
    document.body.appendChild(appElement);
    Modal.setAppElement(appElement);

    renderModal({ isOpen: true, ariaHideApp: false, id: "test-2-modal-1" });
    should(appElement.getAttribute("aria-hidden")).not.be.ok();

    renderModal({ isOpen: true, ariaHideApp: true, id: "test-2-modal-2" });
    appElement.getAttribute("aria-hidden").should.be.eql("true");

    unmountModal();
    should(appElement.getAttribute("aria-hidden")).not.be.ok();
  });

  // eslint-disable-next-line max-len
  it("maintains aria-hidden when unmounted without close and second modal with ariaHideApp=true is open", () => {
    const appElement = document.createElement("div");
    document.body.appendChild(appElement);
    Modal.setAppElement(appElement);

    renderModal({ isOpen: true, ariaHideApp: true, id: "test-3-modal-1" });
    appElement.getAttribute("aria-hidden").should.be.eql("true");

    renderModal({ isOpen: true, ariaHideApp: true, id: "test-3-modal-2" });
    appElement.getAttribute("aria-hidden").should.be.eql("true");

    unmountModal();
    appElement.getAttribute("aria-hidden").should.be.eql("true");
  });

  it("adds --after-open for animations", () => {
    const modal = renderModal({ isOpen: true });
    const rg = /--after-open/i;
    rg.test(mcontent(modal).className).should.be.ok();
    rg.test(moverlay(modal).className).should.be.ok();
  });

  it("adds --before-close for animations", () => {
    const closeTimeoutMS = 50;
    const modal = renderModal({
      isOpen: true,
      closeTimeoutMS
    });
    modal.portal.closeWithTimeout();

    const rg = /--before-close/i;
    rg.test(moverlay(modal).className).should.be.ok();
    rg.test(mcontent(modal).className).should.be.ok();

    modal.portal.closeWithoutTimeout();
  });

  it("should not be open after close with time out and reopen it", () => {
    const modal = renderModal({
      isOpen: true,
      closeTimeoutMS: 2000,
      onRequestClose() {}
    });
    modal.portal.closeWithTimeout();
    modal.portal.open();
    modal.portal.closeWithoutTimeout();
    modal.portal.state.isOpen.should.not.be.ok();
  });

  it("verify default prop of shouldCloseOnOverlayClick", () => {
    const modal = renderModal({ isOpen: true });
    modal.props.shouldCloseOnOverlayClick.should.be.ok();
  });

  it("verify prop of shouldCloseOnOverlayClick", () => {
    const modalOpts = { isOpen: true, shouldCloseOnOverlayClick: false };
    const modal = renderModal(modalOpts);
    modal.props.shouldCloseOnOverlayClick.should.not.be.ok();
  });

  it("keeps the modal in the DOM until closeTimeoutMS elapses", done => {
    const closeTimeoutMS = 100;

    const modal = renderModal({ isOpen: true, closeTimeoutMS });
    modal.portal.closeWithTimeout();

    function checkDOM(count) {
      const overlay = document.querySelectorAll(".ReactModal__Overlay");
      const content = document.querySelectorAll(".ReactModal__Content");
      overlay.length.should.be.eql(count);
      content.length.should.be.eql(count);
    }

    // content is still mounted after modal is gone
    checkDOM(1);

    setTimeout(() => {
      // content is unmounted after specified timeout
      checkDOM(0);
      done();
    }, closeTimeoutMS);
  });

  xit("shouldn't throw if forcibly unmounted during mounting", () => {
    /* eslint-disable camelcase, react/prop-types */
    class Wrapper extends Component {
      constructor(props) {
        super(props);
        this.state = { error: false };
      }
      unstable_handleError() {
        this.setState({ error: true });
      }
      render() {
        return this.state.error ? null : <div>{this.props.children}</div>;
      }
    }
    /* eslint-enable camelcase, react/prop-types */

    const Throw = () => {
      throw new Error("reason");
    };
    const TestCase = () => (
      <Wrapper>
        <Modal />
        <Throw />
      </Wrapper>
    );

    const currentDiv = document.createElement("div");
    document.body.appendChild(currentDiv);

    // eslint-disable-next-line react/no-render-return-value
    const mount = () => ReactDOM.render(<TestCase />, currentDiv);
    mount.should.not.throw();

    document.body.removeChild(currentDiv);
  });

  it("verify that portalClassName is refreshed on component update", () => {
    const node = document.createElement("div");
    let modal = null;

    class App extends Component {
      constructor(props) {
        super(props);
        this.state = { testHasChanged: false };
      }

      componentDidMount() {
        modal.node.className.should.be.eql("myPortalClass");

        this.setState({
          testHasChanged: true
        });
      }

      componentDidUpdate() {
        modal.node.className.should.be.eql("myPortalClass-modifier");
      }

      render() {
        const portalClassName =
          this.state.testHasChanged === true
            ? "myPortalClass-modifier"
            : "myPortalClass";

        return (
          <div>
            <Modal
              ref={modalComponent => {
                modal = modalComponent;
              }}
              isOpen
              portalClassName={portalClassName}
            >
              <span>Test</span>
            </Modal>
          </div>
        );
      }
    }

    Modal.setAppElement(node);
    ReactDOM.render(<App />, node);
  });

  it("use overlayRef and contentRef", () => {
    let overlay = null;
    let content = null;

    renderModal({
      isOpen: true,
      overlayRef: node => (overlay = node),
      contentRef: node => (content = node)
    });

    overlay.should.be.instanceOf(HTMLElement);
    content.should.be.instanceOf(HTMLElement);
    overlay.classList.contains("ReactModal__Overlay");
    content.classList.contains("ReactModal__Content");
  });
};
