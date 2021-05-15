/* eslint-env mocha */
import ReactDOM from "react-dom";
import sinon from "sinon";
import { withModal } from "./helper";

export default () => {
  it("allows ReactDOM.createPortal to be overridden in real-time", () => {
    const createPortalSpy = sinon.spy(ReactDOM, "createPortal");
    const props = { isOpen: true }; 
    withModal(props, "hello");
    createPortalSpy.called.should.be.ok();
    ReactDOM.createPortal.restore();
  });
};
