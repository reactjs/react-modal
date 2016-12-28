import React from 'react';
import ReactDOM from 'react-dom';
import Modal from '../lib/components/Modal';

let _currentDiv = null;

export const renderModal = function(props, children, callback) {
  props.ariaHideApp = false;
  _currentDiv = document.createElement('div');
  document.body.appendChild(_currentDiv);
  return ReactDOM.render(
    <Modal {...props}>{children}</Modal>
  , _currentDiv, callback);
};

export const unmountModal = function() {
  ReactDOM.unmountComponentAtNode(_currentDiv);
  document.body.removeChild(_currentDiv);
  _currentDiv = null;
};
