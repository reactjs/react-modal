/** @jsx React.DOM */
var React = require('react');
var Modal = require('react-modal');
var appElement = document.getElementById('example');

Modal.setAppElement(appElement);

var App = React.createClass({

  getInitialState: function() {
    return {
      modalIsOpen: false
    };
  },

  openModal: function() {
    this.setState({modalIsOpen: !this.state.modalIsOpen});
  },

  render: function() {
    return (
      <div>
        <button onClick={this.openModal}>Open Modal</button>
        <Modal isOpen={this.state.modalIsOpen}>
          <h1>Hello</h1>
          <div>I am a modal</div>
          <form>
            <input />
            <button>hi</button>
          </form>
        </Modal>
      </div>
    );
  }
});

React.renderComponent(<App/>, appElement);
