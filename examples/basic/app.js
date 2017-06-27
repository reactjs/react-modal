import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Modal from '../../src/index';

const appElement = document.getElementById('example');

Modal.setAppElement('#example');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { modal1: false, modal2: false };
  }

  toggleModal_1 = () => {
    this.setState({ ...this.state, modal1: !this.state.modal1 });
  }

  toggleModal_2 = event => {
    event.preventDefault();
    this.setState({ ...this.state, modal2: !this.state.modal2 });
  }

  handleModalCloseRequest = () => {
    // opportunity to validate something and keep the modal open even if it
    // requested to be closed
    this.setState({ ...this.state, modal1: false });
  }

  handleInputChange = () => {
    this.setState({ ...this.state, foo: 'bar' });
  }

  handleOnAfterOpenModal = () => {
    // when ready, we can access the available refs.
    this.refs.title.style.color = '#F00';
  }

  render() {
    const { modal1, modal2 } = this.state;
    return (
      <div>
        <button onClick={this.toggleModal_1}>Open Modal A</button>
        <button onClick={this.toggleModal_2}>Open Modal B</button>
        <Modal
          ref="mymodal"
          id="test"
          closeTimeoutMS={150}
          isOpen={modal1}
          contentLabel="modalA"
          onAfterOpen={this.handleOnAfterOpenModal}
          onRequestClose={this.handleModalCloseRequest}>
          <h1 ref="title">Hello</h1>
          <button onClick={this.toggleModal_1}>close</button>
          <div>I am a modal</div>
          <form>
            <input onChange={this.handleInputChange} />
            <input />
            <input />
            <input />
            <input />
            <br/>
            <button>hi</button>
            <button>hi</button>
            <button>hi</button>
            <button>hi</button>
            <button onClick={this.toggleModal_2}>Open Modal B</button>
          </form>
        </Modal>
        <Modal ref="mymodal2"
               id="test2"
               aria={{
                 labelledby: "heading",
                 describedby: "fulldescription"
               }}
               closeTimeoutMS={150}
               contentLabel="modalB"
               isOpen={modal2}
               onAfterOpen={() => {}}
               onRequestClose={this.toggleModal_2}>
          <h1 id="heading">This is the modal 2!</h1>
          <div id="fulldescription" tabIndex="0" role="document">
            <p>This is a description of what it does: nothing :)</p>
          </div>
        </Modal>
      </div>
    );
  }
}

ReactDOM.render(<App/>, appElement);
