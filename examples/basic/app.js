var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('../../lib/index');

var appElement = document.getElementById('example');

Modal.setAppElement('#example');

Modal.defaultStyles = {
  overlay : {
    position          : 'fixed',
    top               : 0,
    left              : 0,
    right             : 0,
    bottom            : 0,
    backgroundColor   : 'rebeccapurple'
  },
  content : {
    position                   : 'absolute',
    top                        : '40px',
    left                       : '40px',
    right                      : '40px',
    bottom                     : '40px',
    border                     : '1px solid #ccc',
    background                 : '#fff',
    overflow                   : 'auto',
    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '4px',
    outline                    : 'none',
    padding                    : '20px'

  }
}

var App = React.createClass({

  getInitialState: function() {
    return { modalIsOpen: false, modalIsOpen2: false };
  },

  openModal: function() {
    this.setState({modalIsOpen: true});
  },

  openModal2: function() {
    this.setState({modalIsOpen2: true});
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

  handleOnAfterOpenModal: function() {
    // when ready, we can access the available refs.
    this.refs.title.style.color = '#F00';
  },

  render: function() {
    return (
      <div>
        <button onClick={this.openModal}>Open Modal</button>
        <button onClick={this.openModal2}>Open Modal 2</button>
        <Modal
          ref="mymodal"
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
          </form>
        </Modal>
        <Modal
          closeTimeoutMS={150}
          isOpen={this.state.modalIsOpen2}
          onRequestClose={this.handleModalCloseRequest}
        >
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
      </div>
    );
  }
});

ReactDOM.render(<App/>, appElement);
