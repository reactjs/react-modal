/** @jsx React.DOM */
var React = require('react');
var Modal = require('react-modal');

var App = React.createClass({
  render: function() {
    return (
      <div>
        <button onClick={this.openModal}>Open Modal</button>
        <Modal>
          <h1>Hello</h1>
          <div>I am a modal</div>
        </Modal>
      </div>
    );
  }
});

React.renderComponent(<App/>, document.getElementById('example'));
