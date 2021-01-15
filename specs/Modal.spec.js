/* eslint-env mocha */
import should from "should";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import {
  setElement as ariaAppSetElement,
  resetState as ariaAppHiderResetState
} from "react-modal/helpers/ariaAppHider";
import { resetState as bodyTrapReset } from "react-modal/helpers/bodyTrap";
import { resetState as classListReset } from "react-modal/helpers/classList";
import { resetState as focusManagerReset } from "react-modal/helpers/focusManager";
import { resetState as portalInstancesReset } from "react-modal/helpers/portalOpenInstances";
import {
  log,
  isDocumentWithReactModalOpenClass,
  isHtmlWithReactModalOpenClass,
  htmlClassList,
  contentAttribute,
  mcontent,
  moverlay,
  escKeyDown,
  withModal,
  documentClassList,
  withElementCollector,
  createHTMLElement
} from "./helper";

Modal.setCreateHTMLElement(createHTMLElement);

export default () => {
  beforeEach("check for leaks", () => log("before"));
  afterEach("clean up", () => (
    log("after", true),
    bodyTrapReset(),
    classListReset(),
    focusManagerReset(),
    portalInstancesReset(),
    ariaAppHiderResetState()
  ));

  it("can be open initially", () => {
    const props = { isOpen: true };
    withModal(props, "hello", modal => {
      mcontent(modal).should.be.ok();
    });
  });

  it("can be closed initially", () => {
    const props = {};
    withModal(props, "hello", modal => {
      should(ReactDOM.findDOMNode(mcontent(modal))).not.be.ok();
    });
  });

  it("doesn't render the portal if modal is closed", () => {
    const props = {};
    withModal(props, "hello", modal => {
      should(ReactDOM.findDOMNode(modal.portal)).not.be.ok();
    });
  });

  it("has default props", () => {
    withElementCollector(() => {
      // eslint-disable-next-line react/no-render-return-value
      const modal = <Modal />;
      const props = modal.props;
      props.isOpen.should.not.be.ok();
      props.ariaHideApp.should.be.ok();
      props.closeTimeoutMS.should.be.eql(0);
      props.shouldFocusAfterRender.should.be.ok();
      props.shouldCloseOnOverlayClick.should.be.ok();
      props.preventScroll.should.be.false();
    });
  });

  it("accepts appElement as a prop", () => {
    withElementCollector(() => {
      const el = createHTMLElement("div");
      const props = {
        isOpen: true,
        ariaHideApp: true,
        appElement: el
      };
      withModal(props, null, () => {
        el.getAttribute("aria-hidden").should.be.eql("true");
      });
    });
  });

  it("accepts array of appElement as a prop", () => {
    withElementCollector(() => {
      const el1 = createHTMLElement("div");
      const el2 = createHTMLElement("div");
      const node = createHTMLElement("div");
      ReactDOM.render(<Modal isOpen={true} appElement={[el1, el2]} />, node);
      el1.getAttribute("aria-hidden").should.be.eql("true");
      el2.getAttribute("aria-hidden").should.be.eql("true");
      ReactDOM.unmountComponentAtNode(node);
    });
  });

  it("renders into the body, not in context", () => {
    withElementCollector(() => {
      const node = createHTMLElement("div");
      Modal.setAppElement(node);
      ReactDOM.render(<Modal isOpen />, node);
      document.body
        .querySelector(".ReactModalPortal")
        .parentNode.should.be.eql(document.body);
      ReactDOM.unmountComponentAtNode(node);
    });
  });

  it("allow setting appElement of type string", () => {
    withElementCollector(() => {
      const node = createHTMLElement("div");
      const appElement = "body";
      Modal.setAppElement(appElement);
      ReactDOM.render(<Modal isOpen />, node);
      document.body
        .querySelector(".ReactModalPortal")
        .parentNode.should.be.eql(document.body);
      ReactDOM.unmountComponentAtNode(node);
    });
  });

  // eslint-disable-next-line max-len
  it("allow setting appElement of type string matching multiple elements", () => {
    withElementCollector(() => {
      const el1 = createHTMLElement("div");
      el1.id = "id1";
      document.body.appendChild(el1);
      const el2 = createHTMLElement("div");
      el2.id = "id2";
      document.body.appendChild(el2);
      const node = createHTMLElement("div");
      const appElement = "#id1, #id2";
      Modal.setAppElement(appElement);
      ReactDOM.render(<Modal isOpen />, node);
      el1.getAttribute("aria-hidden").should.be.eql("true");
      ReactDOM.unmountComponentAtNode(node);
    });
  });

  it("default parentSelector should be document.body.", () => {
    const props = { isOpen: true };
    withModal(props, null, (modal) => {
      modal.props.parentSelector().should.be.eql(document.body);
    });
  });

  it("renders the modal content with a dialog aria role when provided ", () => {
    const child = "I am a child of Modal, and he has sent me here...";
    const props = { isOpen: true, role: "dialog" };
    withModal(props, child, (modal) => {
      contentAttribute(modal, "role").should.be.eql("dialog");
    });
  });

  // eslint-disable-next-line max-len
  it("renders the modal content with the default aria role when not provided", () => {
    const child = "I am a child of Modal, and he has sent me here...";
    const props = { isOpen: true };
    withModal(props, child, modal => {
      contentAttribute(modal, "role").should.be.eql("dialog");
    });
  });

  it("does not render the aria role when provided role with null", () => {
    const child = "I am a child of Modal, and he has sent me here...";
    const props = { isOpen: true, role: null };
    withModal(props, child, modal => {
      should(contentAttribute(modal, "role")).be.eql(null);
    });
  });

  it("sets aria-label based on the contentLabel prop", () => {
    const child = "I am a child of Modal, and he has sent me here...";
    withModal(
      {
        isOpen: true,
        contentLabel: "Special Modal"
      },
      child,
      modal => {
        contentAttribute(modal, "aria-label").should.be.eql("Special Modal");
      }
    );
  });

  it("removes the portal node", () => {
    const props = { isOpen: true };
    withModal(props, "hello");
    should(document.querySelector(".ReactModalPortal")).not.be.ok();
  });

  it("removes the portal node after closeTimeoutMS", done => {
    const closeTimeoutMS = 100;

    function checkDOM(count) {
      const portal = document.querySelectorAll(".ReactModalPortal");
      portal.length.should.be.eql(count);
    }

    const props = { isOpen: true, closeTimeoutMS };
    withModal(props, "hello", () => {
      checkDOM(1);
    });

    setTimeout(() => {
      // content is unmounted after specified timeout
      checkDOM(0);
      done();
    }, closeTimeoutMS);
  });

  it("focuses the modal content by default", () => {
    const props = { isOpen: true };
    withModal(props, null, modal => {
      document.activeElement.should.be.eql(mcontent(modal));
    });
  });

  it("does not focus modal content if shouldFocusAfterRender is false", () => {
    withModal(
      { isOpen: true, shouldFocusAfterRender: false },
      null,
      modal => {
        document.activeElement.should.not.be.eql(mcontent(modal));
      }
    );
  });

  it("give back focus to previous element or modal.", done => {
    withModal(
      {
        isOpen: true,
        className: "modal-a",
        onRequestClose: function() { done(); }
      },
      null,
      modalA => {
        const modalContent = mcontent(modalA);
        document.activeElement.should.be.eql(modalContent);

        const modalB = withModal(
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
      }
    );
  });

  it("does not steel focus when a descendent is already focused", () => {
    let content;
    const input = (
      <input
        ref={el => {
          el && el.focus();
          content = el;
        }}
      />
    );
    const props = { isOpen: true };
    withModal(props, input, () => {
      document.activeElement.should.be.eql(content);
    });
  });

  it("supports id prop", () => {
    const props = { isOpen: true, id: "id" };
    withModal(props, null, modal => {
      mcontent(modal)
        .id
        .should.be.eql("id");
    });
  });

  it("supports portalClassName", () => {
    const props = {
      isOpen: true,
      portalClassName: "myPortalClass"
    };
    withModal(props, null, modal => {
      modal.node.className.includes("myPortalClass").should.be.ok();
    });
  });

  it("supports custom className", () => {
    const props = { isOpen: true, className: "myClass" };
    withModal(props, null, modal => {
      mcontent(modal)
        .className.includes("myClass")
        .should.be.ok();
    });
  });

  it("supports custom overlayElement", () => {
    const overlayElement = (props, contentElement) => (
      <div {...props} id="custom">
        {contentElement}
      </div>
    );

    const props = { isOpen: true, overlayElement };
    withModal(props, null, modal => {
      const modalOverlay = moverlay(modal);
      modalOverlay.id.should.eql("custom");
    });
  });

  it("supports custom contentElement", () => {
    const contentElement = (props, children) => (
      <div {...props} id="custom">
        {children}
      </div>
    );

    const props = { isOpen: true, contentElement };
    withModal(props, "hello", modal => {
      const modalContent = mcontent(modal);
      modalContent.id.should.eql("custom");
      modalContent.textContent.should.be.eql("hello");
    });
  });

  it("supports overlayClassName", () => {
    const props = {
      isOpen: true,
      overlayClassName: "myOverlayClass"
    };
    withModal(props, null, modal => {
      moverlay(modal)
        .className.includes("myOverlayClass")
        .should.be.ok();
    });
  });

  it("overrides content classes with custom object className", () => {
    withElementCollector(() => {
      const props = {
        isOpen: true,
        className: {
          base: "myClass",
          afterOpen: "myClass_after-open",
          beforeClose: "myClass_before-close"
        }
      };
      const node = createHTMLElement("div");
      const modal = ReactDOM.render(<Modal {...props} />, node);
      requestAnimationFrame(() => {
        mcontent(modal).className.should.be.eql("myClass myClass_after-open");
        ReactDOM.unmountComponentAtNode(node);
      });
    });
  });

  it("overrides overlay classes with custom object overlayClassName", () => {
    withElementCollector(() => {
      const props = {
        isOpen: true,
        overlayClassName: {
          base: "myOverlayClass",
          afterOpen: "myOverlayClass_after-open",
          beforeClose: "myOverlayClass_before-close"
        }
      };
      const node = createHTMLElement("div");
      const modal = ReactDOM.render(<Modal {...props} />, node);
      requestAnimationFrame(() => {
        moverlay(modal).className.should.be.eql(
          "myOverlayClass myOverlayClass_after-open"
        );
        ReactDOM.unmountComponentAtNode(node);
      });
    });
  });

  it("supports overriding react modal open class in document.body.", () => {
    const props = { isOpen: true, bodyOpenClassName: "custom-modal-open" };
    withModal(props, null, () => {
      (document.body.className.indexOf("custom-modal-open") > -1).should.be.ok();
    });
  });

  it("supports setting react modal open class in <html />.", () => {
    const props = { isOpen: true, htmlOpenClassName: "custom-modal-open" };
    withModal(props, null, () => {
      isHtmlWithReactModalOpenClass("custom-modal-open").should.be.ok();
    });
  });

  // eslint-disable-next-line max-len
  it("don't append class to document.body if modal is closed.", () => {
    const props = { isOpen: false };
    withModal(props, null, () => {
      isDocumentWithReactModalOpenClass().should.not.be.ok();
    });
  });

  // eslint-disable-next-line max-len
  it("don't append any class to document.body when bodyOpenClassName is null.", () => {
    const props = { isOpen: true, bodyOpenClassName: null };
    withModal(props, null, () => {
      documentClassList().should.be.empty();
    });
  });

  it("don't append class to <html /> if modal is closed.", () => {
    const props = { isOpen: false, htmlOpenClassName: "custom-modal-open" };
    withModal(props, null, () => {
      isHtmlWithReactModalOpenClass().should.not.be.ok();
    });
  });

  it("append class to document.body if modal is open.", () => {
    const props = { isOpen: true };
    withModal(props, null, () => {
      isDocumentWithReactModalOpenClass().should.be.ok();
    });
  });

  it("don't append class to <html /> if not defined.", () => {
    const props = { isOpen: true };
    withModal(props, null, () => {
      htmlClassList().should.be.empty();
    });
  });

  // eslint-disable-next-line max-len
  it("removes class from document.body when unmounted without closing", () => {
    withModal({ isOpen: true });
    isDocumentWithReactModalOpenClass().should.not.be.ok();
  });

  it("remove class from document.body when no modals opened", () => {
    const propsA = { isOpen: true };
    withModal(propsA, null, () => {
      isDocumentWithReactModalOpenClass().should.be.ok();
    });
    const propsB = { isOpen: true };
    withModal(propsB, null, () => {
      isDocumentWithReactModalOpenClass().should.be.ok();
    });
    isDocumentWithReactModalOpenClass().should.not.be.ok();
    isHtmlWithReactModalOpenClass().should.not.be.ok();
  });

  it("supports adding/removing multiple document.body classes", () => {
    const props = {
      isOpen: true,
      bodyOpenClassName: "A B C"
    };
    withModal(props, null, () => {
      document.body.classList.contains("A", "B", "C").should.be.ok();
    });
    document.body.classList.contains("A", "B", "C").should.not.be.ok();
    ;
  });

  it("does not remove shared classes if more than one modal is open", () => {
    const props = {
      isOpen: true,
      bodyOpenClassName: "A"
    };
    withModal(props, null, () => {
      isDocumentWithReactModalOpenClass("A").should.be.ok();
      withModal({
        isOpen: true,
        bodyOpenClassName: "A B"
      }, null, () => {
        isDocumentWithReactModalOpenClass("A B").should.be.ok();
      });
      isDocumentWithReactModalOpenClass("A").should.be.ok();
    });
    isDocumentWithReactModalOpenClass("A").should.not.be.ok();
  });

  it("should not add classes to document.body for unopened modals", () => {
    const props = { isOpen: true };
    withModal(props, null, () => {
      isDocumentWithReactModalOpenClass().should.be.ok();
    });
    withModal({ isOpen: false, bodyOpenClassName: "testBodyClass" });
    isDocumentWithReactModalOpenClass("testBodyClass").should.not.be.ok();
  });

  it("should not remove classes from document.body if modal is closed", () => {
    const props = { isOpen: true };
    withModal(props, null, () => {
      isDocumentWithReactModalOpenClass().should.be.ok();
      withModal({ isOpen: false, bodyOpenClassName: "testBodyClass" }, null, () => {
        isDocumentWithReactModalOpenClass("testBodyClass").should.not.be.ok();
      });
      isDocumentWithReactModalOpenClass().should.be.ok();
    });
  });

  it("should not remove classes from <html /> if modal is closed", () => {
    const props = { isOpen: false };
    withModal(props, null, () => {
      isHtmlWithReactModalOpenClass().should.not.be.ok();
      withModal({
        isOpen: true,
        htmlOpenClassName: "testHtmlClass"
      }, null, () => {
        isHtmlWithReactModalOpenClass("testHtmlClass").should.be.ok();
      });
      isHtmlWithReactModalOpenClass("testHtmlClass").should.not.be.ok();
    });
  });

  it("additional aria attributes", () => {
    withModal(
      { isOpen: true, aria: { labelledby: "a" } },
      "hello",
      modal => mcontent(modal)
        .getAttribute("aria-labelledby")
        .should.be.eql("a")
    );
  });

  it("additional data attributes", () => {
    withModal(
      { isOpen: true, data: { background: "green" } },
      "hello",
      modal => mcontent(modal)
        .getAttribute("data-background")
        .should.be.eql("green")
    );
  });

  it("additional testId attribute", () => {
    withModal(
      { isOpen: true, testId: "foo-bar" },
      "hello",
      modal => mcontent(modal)
        .getAttribute("data-testid")
        .should.be.eql("foo-bar")
    )
  });

  it("raises an exception if the appElement selector does not match", () => {
    should(() => ariaAppSetElement(".test")).throw();
  });

  it("removes aria-hidden from appElement when unmounted w/o closing", () => {
    withElementCollector(() => {
      const el = createHTMLElement("div");
      const node = createHTMLElement("div");
      ReactDOM.render(<Modal isOpen appElement={el} />, node);
      el.getAttribute("aria-hidden").should.be.eql("true");
      ReactDOM.unmountComponentAtNode(node);
      should(el.getAttribute("aria-hidden")).not.be.ok();
    });
  });

  // eslint-disable-next-line max-len
  it("removes aria-hidden when closed and another modal with ariaHideApp set to false is open", () => {
    withElementCollector(() => {
      const rootNode = createHTMLElement("div");
      const appElement = createHTMLElement("div");
      document.body.appendChild(rootNode);
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
  });

  // eslint-disable-next-line max-len
  it("maintains aria-hidden when closed and another modal with ariaHideApp set to true is open", () => {
    withElementCollector(() => {
      const rootNode = createHTMLElement("div");
      document.body.appendChild(rootNode);

      const appElement = createHTMLElement("div");
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
  });

  // eslint-disable-next-line max-len
  it("removes aria-hidden when unmounted without close and second modal with ariaHideApp=false is open", () => {
    withElementCollector(() => {
      const appElement = createHTMLElement("div");
      document.body.appendChild(appElement);
      Modal.setAppElement(appElement);

      const propsA = { isOpen: true, ariaHideApp: false, id: "test-2-modal-1" };
      withModal(propsA, null, () => {
        should(appElement.getAttribute("aria-hidden")).not.be.ok();
      });

      const propsB = { isOpen: true, ariaHideApp: true, id: "test-2-modal-2" };
      withModal(propsB, null, () => {
        appElement.getAttribute("aria-hidden").should.be.eql("true");
      });

      should(appElement.getAttribute("aria-hidden")).not.be.ok();
    });
  });

  // eslint-disable-next-line max-len
  it("maintains aria-hidden when unmounted without close and second modal with ariaHideApp=true is open", () => {
    withElementCollector(() => {
      const appElement = createHTMLElement("div");
      document.body.appendChild(appElement);
      Modal.setAppElement(appElement);

      const check = (tobe) => appElement.getAttribute("aria-hidden").should.be.eql(tobe);

      const props = { isOpen: true, ariaHideApp: true, id: "test-3-modal-1" };
      withModal(props, null, () => {
        check("true");
        withModal({ isOpen: true, ariaHideApp: true, id: "test-3-modal-2" }, null, () => {
          check("true");
        });
        check("true");
      });
      should(appElement.getAttribute("aria-hidden")).not.be.ok();
    });
  });

  it("adds --after-open for animations", () => {
    withElementCollector(() => {
      const rg = /--after-open/i;
      const props = { isOpen: true };
      const node = createHTMLElement("div");
      const modal = ReactDOM.render(<Modal {...props} />, node);
      requestAnimationFrame(() => {
        const contentName = modal.portal.content.className;
        const overlayName = modal.portal.overlay.className;
        rg.test(contentName).should.be.ok();
        rg.test(overlayName).should.be.ok();
        ReactDOM.unmountComponentAtNode(node);
      });
    });
  });

  it("adds --before-close for animations", () => {
    const closeTimeoutMS = 50;
    const props = {
      isOpen: true,
      closeTimeoutMS
    };
    withModal(props, null, modal => {
      modal.portal.closeWithTimeout();

      const rg = /--before-close/i;
      rg.test(moverlay(modal).className).should.be.ok();
      rg.test(mcontent(modal).className).should.be.ok();

      modal.portal.closeWithoutTimeout();
    });
  });

  it("should not be open after close with time out and reopen it", () => {
    const props = {
      isOpen: true,
      closeTimeoutMS: 2000,
      onRequestClose() { }
    };
    withModal(props, null, modal => {
      modal.portal.closeWithTimeout();
      modal.portal.open();
      modal.portal.closeWithoutTimeout();
      modal.portal.state.isOpen.should.not.be.ok();
    });
  });

  it("verify default prop of shouldCloseOnOverlayClick", () => {
    const props = { isOpen: true };
    withModal(props, null, modal => {
      modal.props.shouldCloseOnOverlayClick.should.be.ok();
    });
  });

  it("verify prop of shouldCloseOnOverlayClick", () => {
    const modalOpts = { isOpen: true, shouldCloseOnOverlayClick: false };
    withModal(modalOpts, null, modal => {
      modal.props.shouldCloseOnOverlayClick.should.not.be.ok();
    });
  });

  it("keeps the modal in the DOM until closeTimeoutMS elapses", done => {
    function checkDOM(count) {
      const overlay = document.querySelectorAll(".ReactModal__Overlay");
      const content = document.querySelectorAll(".ReactModal__Content");
      overlay.length.should.be.eql(count);
      content.length.should.be.eql(count);
    }
    withElementCollector(() => {
      const closeTimeoutMS = 100;
      const props = { isOpen: true, closeTimeoutMS };
      const node = createHTMLElement("div");
      const modal = ReactDOM.render(<Modal {...props} />, node);

      modal.portal.closeWithTimeout();
      checkDOM(1);

      setTimeout(() => {
        checkDOM(0);
        ReactDOM.unmountComponentAtNode(node);
        done();
      }, closeTimeoutMS);
    });
  });

  it("verify that portalClassName is refreshed on component update", () => {
    withElementCollector(() => {
      const node = createHTMLElement("div");
      let modal = null;

      class App extends Component {
        constructor(props) {
          super(props);
          this.state = { classModifier: "" };
        }

        componentDidMount() {
          modal.node.className.should.be.eql("portal");

          this.setState({ classModifier: "-modifier" });
        }

        componentDidUpdate() {
          modal.node.className.should.be.eql("portal-modifier");
        }

        render() {
          const { classModifier } = this.state;
          const portalClassName = `portal${classModifier}`;

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
      ReactDOM.unmountComponentAtNode(node);
    });
  });

  it("use overlayRef and contentRef", () => {
    let overlay = null;
    let content = null;

    const props = {
      isOpen: true,
      overlayRef: node => (overlay = node),
      contentRef: node => (content = node)
    };
    withModal(props, null, () => {
      overlay.should.be.instanceOf(HTMLElement);
      content.should.be.instanceOf(HTMLElement);
      overlay.classList.contains("ReactModal__Overlay");
      content.classList.contains("ReactModal__Content");
    });
  });
};
