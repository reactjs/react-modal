/* eslint-env mocha */
import React from "react";
import ReactDOM from "react-dom";
import "should";
import sinon from "sinon";
import Modal from "react-modal";
import {
  moverlay,
  mcontent,
  clickAt,
  mouseDownAt,
  mouseUpAt,
  escKeyDown,
  escKeyDownWithCode,
  tabKeyDown,
  tabKeyDownWithCode,
  withModal,
  withElementCollector,
  createHTMLElement
} from "./helper";

export default () => {
  it("should trigger the onAfterOpen callback", () => {
    const afterOpenCallback = sinon.spy();
    withElementCollector(() => {
      const props = { isOpen: true, onAfterOpen: afterOpenCallback };
      const node = createHTMLElement("div");
      ReactDOM.render(<Modal {...props} />, node);
      requestAnimationFrame(() => {
        afterOpenCallback.called.should.be.ok();
        ReactDOM.unmountComponentAtNode(node);
      });
    });
  });

  it("should call onAfterOpen with overlay and content references", () => {
    const afterOpenCallback = sinon.spy();
    withElementCollector(() => {
      const props = { isOpen: true, onAfterOpen: afterOpenCallback };
      const node = createHTMLElement("div");
      const modal = ReactDOM.render(<Modal {...props} />, node);
      requestAnimationFrame(() => {
        sinon.assert.calledWith(afterOpenCallback, {
          overlayEl: modal.portal.overlay,
          contentEl: modal.portal.content
        });
        ReactDOM.unmountComponentAtNode(node);
      });
    });
  });

  it("should trigger the onAfterClose callback", () => {
    const onAfterCloseCallback = sinon.spy();
    withModal({
      isOpen: true,
      onAfterClose: onAfterCloseCallback
    });
    onAfterCloseCallback.called.should.be.ok();
  });

  it("should not trigger onAfterClose callback when unmounting a closed modal", () => {
    const onAfterCloseCallback = sinon.spy();
    withModal({ isOpen: false, onAfterClose: onAfterCloseCallback });
    onAfterCloseCallback.called.should.not.be.ok();
  });

  it("should trigger onAfterClose callback when unmounting an opened modal", () => {
    const onAfterCloseCallback = sinon.spy();
    withModal({ isOpen: true, onAfterClose: onAfterCloseCallback });
    onAfterCloseCallback.called.should.be.ok();
  });

  it("keeps focus inside the modal when child has no tabbable elements", () => {
    let tabPrevented = false;
    const props = { isOpen: true }; 
    withModal(props, "hello", modal => {
      const content = mcontent(modal);
      document.activeElement.should.be.eql(content);
      tabKeyDown(content, {
        preventDefault() {
          tabPrevented = true;
        }
      });
      tabPrevented.should.be.eql(true);
    });
  });

  it("handles case when child has no tabbable elements", () => {
    const props = { isOpen: true }; 
    withModal(props, "hello", modal => {
      const content = mcontent(modal);
      tabKeyDown(content);
      document.activeElement.should.be.eql(content);
    });
  });

  it("traps tab in the modal on shift + tab", () => {
    const topButton = <button>top</button>;
    const bottomButton = <button>bottom</button>;
    const modalContent = (
      <div>
        {topButton}
        {bottomButton}
      </div>
    );
    const props = { isOpen: true }; 
    withModal(props, modalContent, modal => {
      const content = mcontent(modal);
      tabKeyDown(content, { shiftKey: true });
      document.activeElement.textContent.should.be.eql("bottom");
    });
  });

  it("traps tab in the modal on shift + tab with KeyboardEvent.code", () => {
    const topButton = <button>top</button>;
    const bottomButton = <button>bottom</button>;
    const modalContent = (
      <div>
        {topButton}
        {bottomButton}
      </div>
    );
    const props = { isOpen: true };
    withModal(props, modalContent, modal => {
      const content = mcontent(modal);
      tabKeyDownWithCode(content, { shiftKey: true });
      document.activeElement.textContent.should.be.eql("bottom");
    });
  });

  describe("shouldCloseOnEsc", () => {
    context("when true", () => {
      it("should close on Esc key event", () => {
        const requestCloseCallback = sinon.spy();
        withModal(
          {
            isOpen: true,
            shouldCloseOnEsc: true,
            onRequestClose: requestCloseCallback
          },
          null,
          modal => {
            escKeyDown(mcontent(modal));
            requestCloseCallback.called.should.be.ok();
            // Check if event is passed to onRequestClose callback.
            const event = requestCloseCallback.getCall(0).args[0];
            event.should.be.ok();
          }
        );
      });

      it("should close on Esc key event with KeyboardEvent.code", () => {
        const requestCloseCallback = sinon.spy();
        withModal(
          {
            isOpen: true,
            shouldCloseOnEsc: true,
            onRequestClose: requestCloseCallback
          },
          null,
          modal => {
            escKeyDownWithCode(mcontent(modal));
            requestCloseCallback.called.should.be.ok();
            // Check if event is passed to onRequestClose callback.
            const event = requestCloseCallback.getCall(0).args[0];
            event.should.be.ok();
          }
        );
      });
    });

    context("when false", () => {
      it("should not close on Esc key event", () => {
        const requestCloseCallback = sinon.spy();
        const props = {
          isOpen: true,
          shouldCloseOnEsc: false,
          onRequestClose: requestCloseCallback
        };
        withModal(props, null, modal => {
          escKeyDown(mcontent(modal));
          requestCloseCallback.called.should.be.false;
        });
      });
    });
  });

  describe("shouldCloseOnoverlayClick", () => {
    it("when false, click on overlay should not close", () => {
      const requestCloseCallback = sinon.spy();
      const props = {
        isOpen: true,
        shouldCloseOnOverlayClick: false
      };
      withModal(props, null, modal => {
        const overlay = moverlay(modal);
        clickAt(overlay);
        requestCloseCallback.called.should.not.be.ok();
      });
    });

    it("when true, click on overlay must close", () => {
      const requestCloseCallback = sinon.spy();
      const props = {
        isOpen: true,
        shouldCloseOnOverlayClick: true,
        onRequestClose: requestCloseCallback
      };
      withModal(props, null, modal => {
        clickAt(moverlay(modal));
        requestCloseCallback.called.should.be.ok();
      });
    });

    it("overlay mouse down and content mouse up, should not close", () => {
      const requestCloseCallback = sinon.spy();
      const props = {
        isOpen: true,
        shouldCloseOnOverlayClick: true,
        onRequestClose: requestCloseCallback
      };
      withModal(props, null, modal => {
        mouseDownAt(moverlay(modal));
        mouseUpAt(mcontent(modal));
        requestCloseCallback.called.should.not.be.ok();
      });
    });

    it("content mouse down and overlay mouse up, should not close", () => {
      const requestCloseCallback = sinon.spy();
      const props = {
        isOpen: true,
        shouldCloseOnOverlayClick: true,
        onRequestClose: requestCloseCallback
      };
      withModal(props, null, modal => {
        mouseDownAt(mcontent(modal));
        mouseUpAt(moverlay(modal));
        requestCloseCallback.called.should.not.be.ok();
      });
    });
  });

  it("should not stop event propagation", () => {
    let hasPropagated = false;
    const props = {
      isOpen: true,
      shouldCloseOnOverlayClick: true
    };
    withModal(props, null, modal => {
      const propagated = () => (hasPropagated = true);
      window.addEventListener("click", propagated);
      const event = new MouseEvent("click", { bubbles: true });
      moverlay(modal).dispatchEvent(event);
      hasPropagated.should.be.ok();
      window.removeEventListener("click", propagated);
    });
  });

  it("verify event passing on overlay click", () => {
    const requestCloseCallback = sinon.spy();
    const props = {
      isOpen: true,
      shouldCloseOnOverlayClick: true,
      onRequestClose: requestCloseCallback
    };
    withModal(props, null, modal => {
      // click the overlay
      clickAt(moverlay(modal), {
        // Used to test that this was the event received
        fakeData: "ABC"
      });
      requestCloseCallback.called.should.be.ok();
      // Check if event is passed to onRequestClose callback.
      const event = requestCloseCallback.getCall(0).args[0];
      event.should.be.ok();
    });
  });

  it("on nested modals, only the topmost should handle ESC key.", () => {
    const requestCloseCallback = sinon.spy();
    const innerRequestCloseCallback = sinon.spy();
    let innerModal = null;
    let innerModalRef = ref => {
      innerModal = ref;
    };

    withModal(
      {
        isOpen: true,
        onRequestClose: requestCloseCallback
      },
      <Modal
        isOpen
        onRequestClose={innerRequestCloseCallback}
        ref={innerModalRef}
      >
        <span>Test</span>
      </Modal>,
      () => {
        const content = mcontent(innerModal);
        escKeyDown(content);
        innerRequestCloseCallback.called.should.be.ok();
        requestCloseCallback.called.should.not.be.ok();
      }
    );
  });
};
