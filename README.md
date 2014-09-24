React Modal
===========

Accessible React Modal Dialog Component

Usage
-----

```xml
<Modal
  isOpen={this.state.modalIsOpen}
  onRequestClose={this.handleModalCloseRequest}
  closeTimeoutMS={150}
>
  <h1>Modal Content</h1>
  <p>Etc.</p>
</Modal>
```

Accessibility Notes
-------------------



Inside the app:

```js
/** @jsx React.DOM */

var React = require('react');
var Modal = require('react-modal');

var appElement = document.getElementById('your-app-element');

Modal.setAppElement(appElement);
Modal.injectCSS();

var App = React.createClass({

  getInitialState: function() {
    return { modalIsOpen: false };
  },

  openModal: function() {
    this.setState({modalIsOpen: true});
  },

  closeModal: function() {
    this.setState({modalIsOpen: false});
  },

  handleModalCloseRequest: function() {
    // opportunity to validate something and keep the modal open even if it
    // requested to be closed
    this.setState({modalIsOpen: false});
  },

  render: function() {
    return (
      <div>
        <button onClick={this.openModal}>Open Modal</button>
        <Modal
          closeTimeoutMS={150}
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.handleModalCloseRequest}
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
```

