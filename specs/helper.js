import React from 'react';
import ReactDOM from 'react-dom';
import Modal from '../lib/components/Modal';


const divStack = [];

export const renderModal = function(props, children, callback) {
  props.ariaHideApp = false;
  const currentDiv = document.createElement('div');
  divStack.push(currentDiv);
  document.body.appendChild(currentDiv);
  return ReactDOM.render(
    <Modal {...props}>{children}</Modal>
  , currentDiv, callback);
};

export const unmountModal = function() {
  const currentDiv = divStack.pop();
  ReactDOM.unmountComponentAtNode(currentDiv);
  document.body.removeChild(currentDiv);
};
