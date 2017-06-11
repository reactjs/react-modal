# react-modal

> Accessible modal dialog component for React.JS

We maintain that accessibility is a key component of any modern web application.  As such, we have created this modal in such a way that it fulfills the accessibility requirements of the modern web.  We seek to keep the focus on accessibility while providing a functional, capable modal component for general use.

## General Usage

The following is an example of using react-modal specifying all the possible props and options:

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
    Function that will be run when the modal is requested to be closed, prior to actually closing.
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
     String className to be applied to the document.body.
     See the `Styles` section for more details.
  */
  bodyOpenClassName="ReactModal__Body--open"
  /*
    Boolean indicating if the appElement should be hidden
  */
  ariaHideApp={true}
  /*
    Boolean indicating if the overlay should close the modal
  */
  shouldCloseOnOverlayClick={true}
  /*
    String indicating the role of the modal, allowing the 'dialog' role to be applied if desired.
  */
  role="dialog"
  /*
    Function that will be called to get the parent element that the modal will be attached to.
  */
  parentSelector={() => document.body}
/>
```

## Install

With [npm](https://npmjs.org/) installed, run

```
$ npm install react-modal
```


## License

MIT
