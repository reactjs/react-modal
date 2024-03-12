import React, { Component } from 'react';
import Modal from 'react-modal';

const MODAL_A = 'modal_a';
const MODAL_B = 'modal_b';

const DEFAULT_TITLE = 'Default title';

class Forms extends Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
  }

  toggleModal = event => {
    console.log(event);
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  }

  render() {
    const { isOpen } = this.state;

    return (
      <div>
        <button className="btn btn-primary" onClick={this.toggleModal}>Open Modal</button>
        <Modal
          id="modal_with_forms"
          isOpen={isOpen}
          closeTimeoutMS={150}
          contentLabel="modalB"
          shouldCloseOnOverlayClick={true}
          onRequestClose={this.toggleModal}
          aria={{
            labelledby: "heading",
            describedby: "fulldescription"
          }}>
          <h1 id="heading">Forms!</h1>
          <div id="fulldescription" tabIndex="0" role="document">
            <p>This is a description of what it does: nothing :)</p>
            <form>
              <fieldset>
                <input type="text"  />
                <input type="text"  />
              </fieldset>
              <fieldset>
                <legend>Radio buttons</legend>
                <label>
                  <input id="radio-a" name="radios" type="radio" /> A
                </label>
                <label>
                  <input id="radio-b" name="radios" type="radio" /> B
                </label>
              </fieldset>
              <fieldset>
                <legend>Checkbox buttons</legend>
                <label>
                  <input id="checkbox-a" name="checkbox-a" type="checkbox" /> A
                </label>
                <label>
                  <input id="checkbox-b" name="checkbox-b" type="checkbox" /> B
                </label>
              </fieldset>
              <input type="text" />
            </form>
          </div>
        </Modal>
      </div>
    );
  }
}

export default {
  label: "Modal with forms fields.",
  app: Forms
};
