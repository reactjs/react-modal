# react-modal

> Accessible modal dialog component for React.JS

We maintain that accessibility is a key component of any modern web application.  As such, we have created this modal in such a way that it fulfills the accessibility requirements of the modern web.  We seek to keep the focus on accessibility while providing a functional, capable modal component for general use.

## Installation {#installation}

To install the stable version you can use [npm](https://npmjs.org/) or [yarn](https://yarnpkg.com):


    $ npm install react-modal
    $ yarn add react-modal


## General Usage {#usage}

The only required prop for the modal object is `isOpen`, which indicates
whether the modal should be displayed.  The following is an example of using
react-modal specifying all the possible props and options:

```js
import ReactModal from 'react-modal';

<ReactModal
  /*
    Boolean describing if the modal should be shown or not.
  */
  isOpen={false}
  /*
    Function that will be run after the modal has opened.
  */
  onAfterOpen={handleAfterOpenFunc}
  /*
    Function that will be run when the modal is requested to be closed (either by clicking on overlay or pressing ESC)
    Note: It is not called if isOpen is changed by other means.
  */
  onRequestClose={handleRequestCloseFunc}
  /*
    Number indicating the milliseconds to wait before closing the modal.
  */
  closeTimeoutMS={0}
  /*
    Object indicating styles to be used for the modal.
    It has two keys, `overlay` and `content`.  See the `Styles` section for more details.
  */
  style={{ overlay: {}, content: {} }}
  /*
    String indicating how the content container should be announced to screenreaders
  */
  contentLabel="Example Modal"
  /*
     String className to be applied to the portal.
     See the `Styles` section for more details.
  */
  portalClassName="ReactModalPortal"
  /*
     String className to be applied to the overlay.
     See the `Styles` section for more details.
  */
  overlayClassName="ReactModal__Overlay"
  /*
     String className to be applied to the modal content.
     See the `Styles` section for more details.
  */
  className="ReactModal__Content"
  /*
     String className to be applied to the document.body (must be a constant string).
     See the `Styles` section for more details.
  */
  bodyOpenClassName="ReactModal__Body--open"
  /*
     String className to be applied to the document.html (must be a constant string).
     This attribute is `null` by default.
     See the `Styles` section for more details.
  */
  htmlOpenClassName="ReactModal__Html--open"
  /*
    Boolean indicating if the appElement should be hidden
  */
  ariaHideApp={true}
  /*
    Boolean indicating if the modal should be focused after render
  */
  shouldFocusAfterRender={true}
  /*
    Boolean indicating if the overlay should close the modal
  */
  shouldCloseOnOverlayClick={true}
  /*
    Boolean indicating if pressing the esc key should close the modal
    Note: By disabling the esc key from closing the modal you may introduce an accessibility issue.
  */
  shouldCloseOnEsc={true}
  /*
    Boolean indicating if the modal should restore focus to the element that
    had focus prior to its display.
  */
  shouldReturnFocusAfterClose={true}
  /*
    String indicating the role of the modal, allowing the 'dialog' role to be applied if desired.
  */
  role="dialog"
  /*
    Function that will be called to get the parent element that the modal will be attached to.
  */
  parentSelector={() => document.body}
  /*
    Additional aria attributes (optional).
  */
  aria={{
    labelledby: "heading",
    describedby: "full_description"
  }}
  /*
    Overlay ref callback.
  */
  overlayRef={setOverlayRef}
  /*
    Content ref callback.
  */
  contentRef={setContentRef}
/>
```

## Using a custom parent node {#custom-parent}

By default, the modal portal will be appended to the document's body.  You can
choose a different parent element by providing a function to the
`parentSelector` prop that returns the element to be used:

```jsx
function getParent() {
  return document.querySelector('#root');
}

<Modal
  ...
  parentSelector={getParent}
  ...
>
  <p>Modal Content.</p>
</Modal>
```

If you do this, please ensure that your
[app element](accessibility/README.md#app-element) is set correctly.  The app
element should not be a parent of the modal, to prevent modal content from
being hidden to screenreaders while it is open.

## Refs {#refs}

You can use ref callbacks to get the overlay and content DOM nodes directly:

```jsx
<Modal
  ...
  overlayRef={node => this.overlayRef = node}
  contentRef={node => this.contentRef = node}
  ...
>
  <p>Modal Content.</p>
</Modal>
```

## License {#license}

MIT
