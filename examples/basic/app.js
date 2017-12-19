import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import SimpleUsage from './simple_usage';
import MultipleModals from './multiple_modals';
import Forms from './forms';
import ReactRouter from './react-router';
import NestedModals from './nested_modals';

const appElement = document.getElementById('example');

Modal.setAppElement('#example');

const examples = [
  SimpleUsage,
  Forms,
  MultipleModals,
  NestedModals,
  ReactRouter
];

class App extends Component {
  render() {
    return (
      <div>
        {examples.map((example, key) => {
          const ExampleApp = example.app;
          return (
            <div key={key + 1} className="example">
              <h3>{`#${key + 1}. ${example.label}`}</h3>
              <ExampleApp />
            </div>
          );
        })}
      </div>
    );
  }
}

ReactDOM.render(<App />, appElement);
