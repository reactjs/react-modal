/** @jsx React.DOM */
var React = require('react');
var Modal = require('../../lib/index');
require('react-tap-event-plugin')();

var appElement = document.getElementById('example');

React.initializeTouchEvents(true);

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
        <button onTouchTap={this.openModal}>Open Modal</button>
        <Modal
          closeTimeoutMS={150}
          dismissable={true}
          isOpen={this.state.modalIsOpen}
          onClose={this.closeModal}
        >
          <h1>Hello</h1>
          <button onTouchTap={this.closeModal}>close</button>
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
