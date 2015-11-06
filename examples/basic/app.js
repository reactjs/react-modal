var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('../../lib/index');

var appElement = document.getElementById('example');

Modal.setAppElement('#example');

var App = React.createClass({

  getInitialState: function() {
    return {
      modalIsOpen: false,
      modalForBodyClass: 'ReactModal__Body--open',
      modal2ForBodyClass: 'ReactModal2__Body--open',
    };
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

  handleInputChange: function() {
    this.setState({foo: 'bar'});
  },

  openModal2: function() {
    this.setState({modalIsOpen2: true});
  },

  closeModal2: function() {
    this.setState({modalIsOpen2: false});
  },

  handleModalCloseRequest2: function() {
    // opportunity to validate something and keep the modal open even if it
    // requested to be closed
    this.setState({modalIsOpen2: false});
  },

  handleInputChange2: function() {
    this.setState({foo2: 'bar2'});
  },

  render: function() {
    return (
      <div>
        <button onClick={this.openModal}>Open Modal</button>
        <button onClick={this.openModal2}>Open Modal2</button>
        <Modal
          closeTimeoutMS={150}
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.handleModalCloseRequest}>
          <h1>Hello</h1>
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
          </form>
        </Modal>
        <Modal
          closeTimeoutMS={150}
          isOpen={this.state.modalIsOpen2}
          onRequestClose={this.handleModalCloseRequest2}
          bodyClass={this.state.modal2ForBodyClass}>
          <h1>Hello</h1>
          <button onClick={this.closeModal2}>close</button>
          <div>I am a modal2</div>
          <form>
            <input onChange={this.handleInputChange2} />
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

ReactDOM.render(<App/>, appElement);
