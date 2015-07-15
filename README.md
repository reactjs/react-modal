React Modal
===========

Accessible React Modal Dialog Component. This isn't ready to be used
yet, still under development.

Accessibility Notes
-------------------

Etc. etc. etc.

Usage
-----

```xml
<Modal
  isOpen={bool}
  onRequestClose={fn}
  closeTimeoutMS={n}
>
  <h1>Modal Content</h1>
  <p>Etc.</p>
</Modal>
```

Inside an app:

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

  render: function() {
    return (
      <div>
        <button onClick={this.openModal}>Open Modal</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
        >
          <h2>Hello</h2>
          <button onClick={this.closeModal}>close</button>
          <div>I am a modal</div>
          <form>
            <input />
            <button>tab navigation</button>
            <button>stays</button>
            <button>inside</button>
            <button>the modal</button>
          </form>
        </Modal>
      </div>
    );
  }
});

React.render(<App/>, appElement);
```

