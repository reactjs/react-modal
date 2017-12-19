import React, { Component } from 'react';
import Modal from 'react-modal';
import MyModal from './modal';

const MODAL_A = 'modal_a';
const MODAL_B = 'modal_b';

const DEFAULT_TITLE = 'Default title';

class SimpleUsage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title1: DEFAULT_TITLE,
      currentModal: null
    };
  }

  toggleModal = key => event => {
    event.preventDefault();
    if (this.state.currentModal) {
      this.handleModalCloseRequest();
      return;
    }

    this.setState({
      ...this.state,
      currentModal: key,
      title1: DEFAULT_TITLE
    });
  }

  handleModalCloseRequest = () => {
    // opportunity to validate something and keep the modal open even if it
    // requested to be closed
    this.setState({
      ...this.state,
      currentModal: null
    });
  }

  handleInputChange = e => {
    let text = e.target.value;
    if (text == '') {
      text = DEFAULT_TITLE;
    }
    this.setState({ ...this.state, title1: text });
  }

  handleOnAfterOpenModal = () => {
    // when ready, we can access the available refs.
    this.heading && (this.heading.style.color = '#F00');
  }

  render() {
    const { currentModal } = this.state;

    return (
      <div>
        <button type="button" className="btn btn-primary" onClick={this.toggleModal(MODAL_A)}>Open Modal A</button>
        <button type="button" className="btn btn-primary" onClick={this.toggleModal(MODAL_B)}>Open Modal B</button>
        <MyModal
          title={this.state.title1}
          isOpen={currentModal == MODAL_A}
          onAfterOpen={this.handleOnAfterOpenModal}
          onRequestClose={this.handleModalCloseRequest}
          askToClose={this.toggleModal(MODAL_A)}
          onChangeInput={this.handleInputChange} />
        <Modal
          ref="mymodal2"
          id="test2"
          aria={{
            labelledby: "heading",
            describedby: "fulldescription"
          }}
          closeTimeoutMS={150}
          contentLabel="modalB"
          isOpen={currentModal == MODAL_B}
          shouldCloseOnOverlayClick={false}
          onAfterOpen={this.handleOnAfterOpenModal}
          onRequestClose={this.toggleModal(MODAL_B)}>
          <h1 id="heading" ref={h1 => this.heading = h1}>This is the modal 2!</h1>
          <div id="fulldescription" tabIndex="0" role="document">
            <p>This is a description of what it does: nothing :)</p>
          </div>
        </Modal>
      </div>
    );
  }
}

export default {
  label: "Working with one modal at a time.",
  app: SimpleUsage
};
