import React from 'react';
import Modal from 'react-modal';

export default props => {
  const {
    title, isOpen, askToClose,
    onAfterOpen, onRequestClose, onChangeInput
  } = props;

  return (
    <Modal
      id="test"
      contentLabel="modalA"
      closeTimeoutMS={150}
      isOpen={isOpen}
      onAfterOpen={onAfterOpen}
      onRequestClose={onRequestClose}>
      <h1>{title}</h1>
      <button onClick={askToClose} aria-label="Close Modal">close</button>
      <div>I am a modal. Use the first input to change the modal's title.</div>
      <form>
        <label htmlFor="title-input">
          Modal Title:
          <input id="title-input" onChange={onChangeInput} aria-label="Modal Title Input" />
        </label>
        <label htmlFor="additional-input">
          Additional Input:
          <input id="additional-input" aria-label="Additional Input" />
        </label>
        <br />
        <button type="button" aria-label="Button A">Button A</button>
        <button type="button" aria-label="Button B">Button B</button>
        <button type="button" aria-label="Button C">Button C</button>
        <button type="button" aria-label="Button D">Button D</button>
      </form>
    </Modal>
  );
}
