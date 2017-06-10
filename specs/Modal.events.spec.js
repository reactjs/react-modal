import sinon from 'sinon';
import expect from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Modal from '../lib/components/Modal';
import * as ariaAppHider from '../lib/helpers/ariaAppHider';
import {
  isBodyWithReactModalOpenClass, findDOMWithClass,
  contentAttribute, overlayAttribute,
  moverlay, mcontent,
  clickAt, mouseDownAt, mouseUpAt, escKeyDown, tabKeyDown,
  renderModal, unmountModal, emptyDOM
} from './helper';

describe('Events', () => {
  afterEach('Unmount modal', emptyDOM);

  it('should trigger the onAfterOpen callback', () => {
    var afterOpenCallback = sinon.spy();
    renderModal({ isOpen: true, onAfterOpen: afterOpenCallback });
    expect(afterOpenCallback.called).toBeTruthy();
  });

  it('keeps focus inside the modal when child has no tabbable elements', () => {
    var tabPrevented = false;
    var modal = renderModal({ isOpen: true }, 'hello');
    const content = mcontent(modal);
    expect(document.activeElement).toEqual(content);
    tabKeyDown(content, {
      preventDefault: function() { tabPrevented = true; }
    });
    expect(tabPrevented).toEqual(true);
  });

  it('handles case when child has no tabbable elements', () => {
    var modal = renderModal({ isOpen: true }, 'hello');
    const content = mcontent(modal);
    tabKeyDown(content);
    expect(document.activeElement).toEqual(content);
  });

  it('should close on Esc key event', () => {
    var requestCloseCallback = sinon.spy();
    var modal = renderModal({
      isOpen: true,
      shouldCloseOnOverlayClick: true,
      onRequestClose: requestCloseCallback
    });
    escKeyDown(mcontent(modal));
    expect(requestCloseCallback.called).toBeTruthy();
    // Check if event is passed to onRequestClose callback.
    var event = requestCloseCallback.getCall(0).args[0];
    expect(event).toExist();
  });

  it('verify overlay click when shouldCloseOnOverlayClick sets to false', () => {
    const requestCloseCallback = sinon.spy();
    const modal = renderModal({
      isOpen: true,
      shouldCloseOnOverlayClick: false
    });
    var overlay = moverlay(modal);
    clickAt(overlay);
    expect(!requestCloseCallback.called).toBeTruthy();
  });

  it('verify overlay click when shouldCloseOnOverlayClick sets to true', () => {
    var requestCloseCallback = sinon.spy();
    var modal = renderModal({
      isOpen: true,
      shouldCloseOnOverlayClick: true,
      onRequestClose: function() {
        requestCloseCallback();
      }
    });
    clickAt(moverlay(modal));
    expect(requestCloseCallback.called).toBeTruthy();
  });

  it('verify overlay mouse down and content mouse up when shouldCloseOnOverlayClick sets to true', () => {
    const requestCloseCallback = sinon.spy();
    const modal = renderModal({
      isOpen: true,
      shouldCloseOnOverlayClick: true,
      onRequestClose: requestCloseCallback
    });
    mouseDownAt(moverlay(modal));
    mouseUpAt(mcontent(modal));
    expect(!requestCloseCallback.called).toBeTruthy();
  });

  it('verify content mouse down and overlay mouse up when shouldCloseOnOverlayClick sets to true', () => {
    var requestCloseCallback = sinon.spy();
    var modal = renderModal({
      isOpen: true,
      shouldCloseOnOverlayClick: true,
      onRequestClose: function() {
        requestCloseCallback();
      }
    });
    mouseDownAt(mcontent(modal));
    mouseUpAt(moverlay(modal));
    expect(!requestCloseCallback.called).toBeTruthy();
  });

  it('should not stop event propagation', () => {
    var hasPropagated = false;
    var modal = renderModal({
      isOpen: true,
      shouldCloseOnOverlayClick: true
    });
    window.addEventListener('click', () => {
      hasPropagated = true;
    });
    moverlay(modal).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(hasPropagated).toBeTruthy();
  });

  it('verify event passing on overlay click', () => {
    var requestCloseCallback = sinon.spy();
    var modal = renderModal({
      isOpen: true,
      shouldCloseOnOverlayClick: true,
      onRequestClose: requestCloseCallback
    });
    // click the overlay
    clickAt(moverlay(modal), {
      // Used to test that this was the event received
      fakeData: 'ABC'
    });
    expect(requestCloseCallback.called).toBeTruthy();
    // Check if event is passed to onRequestClose callback.
    var event = requestCloseCallback.getCall(0).args[0];
    expect(event).toExist();
  });
});
