import React from 'react';
import ReactDOM from 'react-dom';
import Modal from '../../lib/index';

var appElement = document.getElementById('example');

Modal.setAppElement('#example');

var App = React.createClass({

  getInitialState: function() {
    return { modalIsOpen: false, modal2: false };
  },

  openModal: function() {
    this.setState({ ...this.state, modalIsOpen: true });
  },

  closeModal: function() {
    this.setState({ ...this.state, modalIsOpen: false });
  },

  openSecondModal: function(event) {
    event.preventDefault();
    this.setState({ ...this.state, modal2:true });
  },

  closeSecondModal: function() {
    this.setState({ ...this.state, modal2:false });
  },

  handleModalCloseRequest: function() {
    // opportunity to validate something and keep the modal open even if it
    // requested to be closed
    this.setState({ ...this.state, modalIsOpen: false });
  },

  handleInputChange: function() {
    this.setState({ foo: 'bar' });
  },

  handleOnAfterOpenModal: function() {
    // when ready, we can access the available refs.
    this.refs.title.style.color = '#F00';
  },

  render: function() {
    return (
      <div>
        <button onClick={this.openModal}>Open Modal A</button>
        <button onClick={this.openSecondModal}>Open Modal B</button>
        <Modal
          ref="mymodal"
          id="test"
          closeTimeoutMS={150}
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.handleOnAfterOpenModal}
          onRequestClose={this.handleModalCloseRequest}>
          <h1 ref="title">Hello</h1>
          <button onClick={this.closeModal}>close</button>
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
            <button onClick={this.openSecondModal}>Open Modal B</button>
          </form>
        </Modal>
        <Modal ref="mymodal2"
               id="test2"
               closeTimeoutMS={150}
               isOpen={this.state.modal2}
               onAfterOpen={() => {}}
               onRequestClose={this.closeSecondModal}>
          <p>test</p>
        </Modal>
      </div>
    );
  }
});

ReactDOM.render(<App/>, appElement);
