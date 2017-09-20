import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import SimpleUsage from './simple_usage';
import MultipleModals from './multiple_modals';

const appElement = document.getElementById('example');

Modal.setAppElement('#example');

const examples = [
  SimpleUsage,
  MultipleModals
];

function App(props) {
  return examples.map((example, key) => {
    const ExampleApp = example.app;
    return (
      <div key={key} className="example">
        <h3>{example.label}</h3>
        <ExampleApp />
      </div>
    );
  });
}

ReactDOM.render(<App/>, appElement);
