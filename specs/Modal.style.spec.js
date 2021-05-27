/* eslint-env mocha */
import "should";
import Modal from "react-modal";
import { mcontent, moverlay, withModal } from "./helper";

export default () => {
  it("overrides the default styles when a custom classname is used", () => {
    const props = { isOpen: true, className: "myClass" }; 
    withModal(props, null, modal => {
      mcontent(modal).style.top.should.be.eql("");
    });
  });

  it("overrides the default styles when using custom overlayClassName", () => {
    const overlayClassName = "myOverlayClass";
    const props = { isOpen: true, overlayClassName }; 
    withModal(props, null, modal => {
      moverlay(modal).style.backgroundColor.should.be.eql("");
    });
  });

  it("supports adding style to the modal contents", () => {
    const style = { content: { width: "20px" } };
    const props = { isOpen: true, style }; 
    withModal(props, null, modal => {
      mcontent(modal).style.width.should.be.eql("20px");
    });
  });

  it("supports overriding style on the modal contents", () => {
    const style = { content: { position: "static" } };
    const props = { isOpen: true, style }; 
    withModal(props, null, modal => {
      mcontent(modal).style.position.should.be.eql("static");
    });
  });

  it("supports adding style on the modal overlay", () => {
    const style = { overlay: { width: "75px" } };
    const props = { isOpen: true, style }; 
    withModal(props, null, modal => {
      moverlay(modal).style.width.should.be.eql("75px");
    });
  });

  it("supports overriding style on the modal overlay", () => {
    const style = { overlay: { position: "static" } };
    const props = { isOpen: true, style }; 
    withModal(props, null, modal => {
      moverlay(modal).style.position.should.be.eql("static");
    });
  });

  it("supports overriding the default styles", () => {
    const previousStyle = Modal.defaultStyles.content.position;
    // Just in case the default style is already relative,
    // check that we can change it
    const newStyle = previousStyle === "relative" ? "static" : "relative";
    Modal.defaultStyles.content.position = newStyle;
    const props = { isOpen: true }; 
    withModal(props, null, modal => {
      modal.portal.content.style.position.should.be.eql(newStyle);
      Modal.defaultStyles.content.position = previousStyle;
    });
  });
};
