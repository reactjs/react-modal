/** @jsx React.DOM */
var React = require('react');
var Modal = require('../../lib/index');
require('react-tap-event-plugin')();

var appElement = document.getElementById('example');

Modal.setAppElement(appElement);
Modal.injectCSS();

var App = React.createClass({

  openModal: function() {
    this.refs.modal.open();
  },

  closeModal: function() {
    this.refs.modal.close();
  },

  render: function() {
    return (
      <div>
        <button onClick={this.openModal}>Open Modal</button>
        <Modal
          ref="modal"
          closeTimeoutMS={150}
          dismissable={true}
        >
          <h1>Hello</h1>
          <button onClick={this.closeModal}>close</button>
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
