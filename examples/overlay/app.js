import React from 'react';
import ReactDOM from 'react-dom';
import Modal from '../../lib/index';

const appElement = document.getElementById('example');

Modal.setAppElement('#example');

const MyOverlay = React.createClass({
  render: function() {
    const { children, content, ...restProps } = this.props;

    return (
      <div {...restProps} >
        {children}
        <p
          style={{
            position: 'absolute',
            bottom: '5px',
            right: '20px',
            margin: '3px'
          }}
        >
          {content}
        </p>
      </div>
    );
  }
});

const App = React.createClass({
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

  handleInputChange: function() {
    this.setState({foo: 'bar'});
  },

  render: function() {
    return (
      <div>
        <button onClick={this.openModal}>Open Modal</button>
        <Modal
          ref="mymodal"
          closeTimeoutMS={150}
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.handleModalCloseRequest}
          overlay={
            <MyOverlay content="Some special content in overlay" />
          }
        >
          <h1>Note overlay text</h1>
          <button onClick={this.closeModal}>close</button>
        </Modal>
      </div>
    );
  }
});

ReactDOM.render(<App/>, appElement);
