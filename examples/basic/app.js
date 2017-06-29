import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Modal from '../../src/index';
import ViewA from './view_a';
import ViewB from './view_b';

const appElement = document.getElementById('example');

Modal.setAppElement('#example');

const heading = firstView => {
  if (firstView) {
    return "#1. Working with one modal at a time.";
  }
  return "#2. Working with many modal.";
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { firstView: true };
  }

  toggleView = () => {
    this.setState({ ...this.state, firstView: !this.state.firstView });
  }

  render() {
    return (
      <div>
        <button onClick={this.toggleView}>Click to go to the next example!</button>
        <h2>{heading(this.state.firstView)}</h2>
        {this.state.firstView ? <ViewA /> : <ViewB />}
      </div>
    );
  }
}

ReactDOM.render(<App/>, appElement);
