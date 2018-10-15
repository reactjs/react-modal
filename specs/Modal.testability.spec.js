/* eslint-env mocha */
import ReactDOM from "react-dom";
import sinon from "sinon";
import { mcontent, renderModal, emptyDOM } from "./helper";

export default () => {
  afterEach("cleaned up all rendered modals", emptyDOM);

  it("renders as expected, initially", () => {
    const modal = renderModal({ isOpen: true }, "hello");
    mcontent(modal).should.be.ok();
  });

  it("allows ReactDOM.createPortal to be overridden in real-time", () => {
    const createPortalSpy = sinon.spy(ReactDOM, "createPortal");
    renderModal({ isOpen: true }, "hello");
    createPortalSpy.called.should.be.ok();
    ReactDOM.createPortal.restore();
  });
};
