import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import SimpleUsage from './simple_usage';
import MultipleModals from './multiple_modals';
import ReactRouter from './react-router';

const appElement = document.getElementById('example');

Modal.setAppElement('#example');

const examples = [
  SimpleUsage,
  MultipleModals,
  ReactRouter
];

class App extends Component {
  render() {
    return (
      <div>
        {examples.map((example, key) => {
          const ExampleApp = example.app;
          return (
            <div key={key} className="example">
              <h3>{example.label}</h3>
              <ExampleApp />
            </div>
          );
        })}
      </div>
    );
  }
}

ReactDOM.render(<App />, appElement);
