/** @jsx React.DOM */
var React = require('react');
var Modal = require('react-modal');
var appElement = document.getElementById('example');

Modal.setAppElement(appElement);
Modal.injectCSS();

var App = React.createClass({

  getInitialState: function() {
    return {
      modalIsOpen: false
    };
  },

  openModal: function() {
    this.setState({modalIsOpen: !this.state.modalIsOpen});
  },

  closeModal: function() {
    this.setState({modalIsOpen: false});
  },

  render: function() {
    return (
      <div>
        <button onClick={this.openModal}>Open Modal</button>
        <Modal
          closeTimeoutMS={150}
          dismissable={true}
          isOpen={this.state.modalIsOpen}
          onClose={this.closeModal}
        >
          <h1>Hello</h1>
          <div>I am a modal</div>
          <form>
            <input />
            <input />
            <input />
            <input />
            <input />
            <br/>
            <button>hi</button>
            <button>hi</button>
            <button>hi</button>
            <button>hi</button>
          </form>
        </Modal>
      </div>
    );
  }
});

React.renderComponent(<App/>, appElement);
