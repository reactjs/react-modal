/* eslint-env mocha */
import sinon from 'sinon';
import expect from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import Modal from '../src/components/Modal';
import {
  moverlay, mcontent,
  clickAt, mouseDownAt, mouseUpAt, escKeyDown, tabKeyDown,
  renderModal, emptyDOM
} from './helper';

describe('Events', () => {
  afterEach('Unmount modal', emptyDOM);

  it('should trigger the onAfterOpen callback', () => {
    const afterOpenCallback = sinon.spy();
    renderModal({ isOpen: true, onAfterOpen: afterOpenCallback });
    expect(afterOpenCallback.called).toBeTruthy();
  });

  it('keeps focus inside the modal when child has no tabbable elements', () => {
    let tabPrevented = false;
    const modal = renderModal({ isOpen: true }, 'hello');
    const content = mcontent(modal);
    expect(document.activeElement).toEqual(content);
    tabKeyDown(content, {
      preventDefault() { tabPrevented = true; }
    });
    expect(tabPrevented).toEqual(true);
  });

  it('handles case when child has no tabbable elements', () => {
    const modal = renderModal({ isOpen: true }, 'hello');
    const content = mcontent(modal);
    tabKeyDown(content);
    expect(document.activeElement).toEqual(content);
  });

  it('should close on Esc key event', () => {
    const requestCloseCallback = sinon.spy();
    const modal = renderModal({
      isOpen: true,
      shouldCloseOnOverlayClick: true,
      onRequestClose: requestCloseCallback
    });
    escKeyDown(mcontent(modal));
    expect(requestCloseCallback.called).toBeTruthy();
    // Check if event is passed to onRequestClose callback.
    const event = requestCloseCallback.getCall(0).args[0];
    expect(event).toExist();
  });

  describe('shouldCloseOnoverlayClick', () => {
    it('when false, click on overlay should not close', () => {
      const requestCloseCallback = sinon.spy();
      const modal = renderModal({
        isOpen: true,
        shouldCloseOnOverlayClick: false
      });
      const overlay = moverlay(modal);
      clickAt(overlay);
      expect(!requestCloseCallback.called).toBeTruthy();
    });

    it('when true, click on overlay must close', () => {
      const requestCloseCallback = sinon.spy();
      const modal = renderModal({
        isOpen: true,
        shouldCloseOnOverlayClick: true,
        onRequestClose: requestCloseCallback
      });
      clickAt(moverlay(modal));
      expect(requestCloseCallback.called).toBeTruthy();
    });

    it('overlay mouse down and content mouse up, should not close', () => {
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

    it('content mouse down and overlay mouse up, should not close', () => {
      const requestCloseCallback = sinon.spy();
      const modal = renderModal({
        isOpen: true,
        shouldCloseOnOverlayClick: true,
        onRequestClose: requestCloseCallback
      });
      mouseDownAt(mcontent(modal));
      mouseUpAt(moverlay(modal));
      expect(!requestCloseCallback.called).toBeTruthy();
    });
  });

  it('should not stop event propagation', () => {
    let hasPropagated = false;
    const modal = renderModal({
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
    const requestCloseCallback = sinon.spy();
    const modal = renderModal({
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
    const event = requestCloseCallback.getCall(0).args[0];
    expect(event).toExist();
  });
});
