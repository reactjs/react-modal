// The following eslint overrides should be removed when refactoring can occur

/* eslint react/no-render-return-value: "warn" */
import React from 'react';
import ReactDOM from 'react-dom';
import Modal from '../src/components/Modal';

const divStack = [];

export function renderModal (props, children, callback) {
  const myProps = {
    ariaHideApp: false,
    ...props
  };
  const currentDiv = document.createElement('div');
  divStack.push(currentDiv);
  document.body.appendChild(currentDiv);
  return ReactDOM.render(
    <Modal {...myProps}>{children}</Modal>
  , currentDiv, callback);
}

export const unmountModal = () => {
  const currentDiv = divStack.pop();
  ReactDOM.unmountComponentAtNode(currentDiv);
  document.body.removeChild(currentDiv);
};

export const emptyDOM = () => {
  while (divStack.length) {
    unmountModal();
  }
};
