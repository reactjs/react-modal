import React from 'react';
import ReactDOM from 'react-dom';
import Modal from '../../lib/index';

const appElement = document.getElementById('example');

class App extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      modalIsOpen: false,
      modal2: false
    };
  }

  openModal () {
    this.setState({ ...this.state, modalIsOpen: true });
  }

  closeModal () {
    this.setState({ ...this.state, modalIsOpen: false });
  }

  openSecondModal (event) {
    event.preventDefault();
    this.setState({ ...this.state, modal2: true });
  }

  closeSecondModal () {
    this.setState({ ...this.state, modal2: false });
  }

  handleModalCloseRequest () {
    // opportunity to validate something and keep the modal open even if it
    // requested to be closed
    this.setState({ ...this.state, modalIsOpen: false });
  }

  handleInputChange () {
    this.setState({ foo: 'bar' });
  }

  handleOnAfterOpenModal () {
    // when ready, we can access the available refs.
    this.title.style.color = '#F00';
  }

  render () {
    return (
      <div>
        <button onClick={() => this.openModal()}>Open Modal A</button>
        <button onClick={e => this.openSecondModal(e)}>Open Modal B</button>
        <Modal
          ref={(c) => { this.mymodal = c; }}
          getAppElement={() => appElement}
          id="test"
          closeTimeoutMS={150}
          isOpen={this.state.modalIsOpen}
          onAfterOpen={() => this.handleOnAfterOpenModal()}
          onRequestClose={() => this.handleModalCloseRequest()}
          contentLabel="Modal"
        >
          <h1
            ref={(c) => { this.title = c; }}
          >
            Hello
          </h1>
          <button onClick={() => this.closeModal()}>close</button>
          <div>I am a modal</div>
          <form>
            <input onChange={() => this.handleInputChange()} />
            <input />
            <input />
            <input />
            <input />
            <br />
            <button>hi</button>
            <button>hi</button>
            <button>hi</button>
            <button>hi</button>
            <button onClick={e => this.openSecondModal(e)}>Open Modal B</button>
          </form>
        </Modal>
        <Modal
          ref={(c) => { this.mymodal2 = c; }}
          getAppElement={() => appElement}
          id="test2"
          closeTimeoutMS={150}
          isOpen={this.state.modal2}
          onAfterOpen={() => {}}
          onRequestClose={() => this.closeSecondModal()}
          contentLabel="Modal"
        >
          <p>test</p>
        </Modal>
      </div>
    );
  }
}

ReactDOM.render(<App />, appElement);
