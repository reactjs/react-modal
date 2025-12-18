import React, { Component } from "react";
import Modal from "react-modal";

class ModalClose extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  toggleModal = (event) => {
    this.setState({ isOpen: !this.state.isOpen });
  };
  handleRightClick = (event) => {
    this.setState({ isOpen: false });
  };

  render() {
    return (
      <div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={this.toggleModal}
        >
          Open Modal
        </button>
        <Modal
          isOpen={this.state.isOpen}
          onOverlayRightClick={this.handleRightClick}
        >
          <h1>Click Right on the Overlay to close the modal</h1>
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.toggleModal}
          >
            Close
          </button>
        </Modal>
      </div>
    );
  }
}

export default {
  label: "Modal close on right click",
  app: ModalClose,
};
