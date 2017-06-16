/* eslint-env mocha */
import expect from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Modal from '../src/components/Modal';
import * as ariaAppHider from '../src/helpers/ariaAppHider';
import {
  mcontent, moverlay,
  renderModal, emptyDOM
} from './helper';

describe('Style', () => {
  afterEach('Unmount modal', emptyDOM);

  it('overrides the default styles when a custom classname is used', () => {
    const modal = renderModal({ isOpen: true, className: 'myClass' });
    expect(mcontent(modal).style.top).toEqual('');
  });

  it('overrides the default styles when a custom overlayClassName is used',
    () => {
      const modal = renderModal({
        isOpen: true,
        overlayClassName: 'myOverlayClass'
      });
      expect(moverlay(modal).style.backgroundColor).toEqual('');
    }
  );

  it('supports adding style to the modal contents', () => {
    const style = { content: { width: '20px' } };
    const modal = renderModal({ isOpen: true, style });
    expect(mcontent(modal).style.width).toEqual('20px');
  });

  it('supports overriding style on the modal contents', () => {
    const style = { content: { position: 'static' } };
    const modal = renderModal({ isOpen: true, style });
    expect(mcontent(modal).style.position).toEqual('static');
  });

  it('supports adding style on the modal overlay', () => {
    const style = { overlay: { width: '75px' } };
    const modal = renderModal({ isOpen: true, style });
    expect(moverlay(modal).style.width).toEqual('75px');
  });

  it('supports overriding style on the modal overlay', () => {
    const style = { overlay: { position: 'static' } };
    const modal = renderModal({ isOpen: true, style });
    expect(moverlay(modal).style.position).toEqual('static');
  });

  it('supports overriding the default styles', () => {
    const previousStyle = Modal.defaultStyles.content.position;
    // Just in case the default style is already relative,
    // check that we can change it
    const newStyle = previousStyle === 'relative' ? 'static' : 'relative';
    Modal.defaultStyles.content.position = newStyle;
    const modal = renderModal({ isOpen: true });
    expect(modal.portal.content.style.position).toEqual(newStyle);
    Modal.defaultStyles.content.position = previousStyle;
  });
});
