// The following eslint overrides should be removed when refactoring can occur

/* eslint react/no-render-return-value: "warn" */
import React from 'react';
import ReactDOM from 'react-dom';
import Modal from '../../lib/components/Modal';

let currentDiv = null;

export function renderModal (props, children, callback) {
  const myProps = {
    ariaHideApp: false,
    ...props
  };
  currentDiv = document.createElement('div');
  document.body.appendChild(currentDiv);
  return ReactDOM.render(
    <Modal {...myProps}>{children}</Modal>
  , currentDiv, callback);
}

export const unmountModal = () => {
  ReactDOM.unmountComponentAtNode(currentDiv);
  document.body.removeChild(currentDiv);
  currentDiv = null;
};
