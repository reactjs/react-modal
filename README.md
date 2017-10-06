# react-modal

Accessible modal dialog component for React.JS

[![Build Status](https://travis-ci.org/reactjs/react-modal.svg?branch=v1)](https://travis-ci.org/reactjs/react-modal)
[![Code Climate](https://codeclimate.com/github/reactjs/react-modal/badges/gpa.svg)](https://codeclimate.com/github/reactjs/react-modal)
[![Coverage Status](https://coveralls.io/repos/github/reactjs/react-modal/badge.svg?branch=master)](https://coveralls.io/github/reactjs/react-modal?branch=master)
![gzip size](http://img.badgesize.io/https://unpkg.com/react-modal/dist/react-modal.min.js?compression=gzip)

## React 16

A initial support for React 16 is available under the branch `next`.

Please, when open a new PR set the target branch `next` for `react-modal@3.x` and `master` for `2.x`.

Note that it can be unstable.

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [Styles](#styles)
* [Examples](#examples)
* [Testing](#testing)
* [Demos](#demos)

## Installation

To install, you can use [npm](https://npmjs.org/) or [yarn](https://yarnpkg.com):

    With React 16 support (3.0.0-rc2):

    $ npm install react-modal@next
    $ yarn add react-modal@next

    To install the stable version (2.4.1):

    $ npm install react-modal
    $ yarn add react-modal


## Usage

The Modal object has one required prop:

- `isOpen` to render its children.

Example:

```jsx
<Modal
  isOpen={bool}
  onAfterOpen={afterOpenFn}
  onRequestClose={requestCloseFn}
  closeTimeoutMS={n}
  style={customStyle}
  contentLabel="Modal"
>
  <h1>Modal Content</h1>
  <p>Etc.</p>
</Modal>
```

> Use the prop `contentLabel` which adds `aria-label` to the modal if there is no label text visible on the screen, otherwise specify the element including the label text using `aria-labelledby`

### App Element

The app element allows you to specify the portion
of your app that should be hidden (via aria-hidden)
to prevent assistive technologies such as screenreaders
from reading content outside of the content of
your modal.

It's optional and if not specified it will try to use
`document.body` as your app element.

If you are doing server-side rendering, you should use
this property.

It can be specified in the following ways:

- DOMElement

```js
Modal.setAppElement(appElement);
```

- query selector - uses the first element found if you pass in a class.

```js
Modal.setAppElement('#your-app-element');
```

### Additional Aria Attributes

Use the property `aria` to pass any additional aria attributes. It accepts
an object where the keys are the names of the attributes without the prefix
`aria-`.

Example:

```jsx
<Modal
  isOpen={modalIsOpen}
  aria={{
    labelledby: "heading",
    describedby: "full_description"
  }}>
  <h1 id="heading">H1</h1>
  <div id="full_description">
    <p>Description goes here.</p>
  </div>
</Modal>
```

## Styles

Styles are passed as an object with 2 keys, 'overlay' and 'content' like so

```js
{
  overlay : {
    position          : 'fixed',
    top               : 0,
    left              : 0,
    right             : 0,
    bottom            : 0,
    backgroundColor   : 'rgba(255, 255, 255, 0.75)'
  },
  content : {
    position                   : 'absolute',
    top                        : '40px',
    left                       : '40px',
    right                      : '40px',
    bottom                     : '40px',
    border                     : '1px solid #ccc',
    background                 : '#fff',
    overflow                   : 'auto',
    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '4px',
    outline                    : 'none',
    padding                    : '20px'

  }
}
```

Styles passed to the modal are merged in with the above defaults and applied to their respective elements.
At this time, media queries will need to be handled by the consumer.

### Using CSS Classes

If you prefer not to use inline styles or are unable to do so in your project,
you can pass `className` and `overlayClassName` props to the Modal.  If you do
this then none of the default styles will apply and you will have full control
over styling via CSS.

If you want to override default content and overlay classes you can pass object
with three required properties: `base`, `afterOpen`, `beforeClose`.

```jsx
<Modal
  ...
  className={{
    base: 'myClass',
    afterOpen: 'myClass_after-open',
    beforeClose: 'myClass_before-close'
  }}
  overlayClassName={{
    base: 'myOverlayClass',
    afterOpen: 'myOverlayClass_after-open',
    beforeClose: 'myOverlayClass_before-close'
  }}
  ...
>
```

You can also pass a `portalClassName` to change the wrapper's class (*ReactModalPortal*).
This doesn't affect styling as no styles are applied to this element by default.

### Overriding styles globally

The default styles above are available on `Modal.defaultStyles`. Changes to this
object will apply to all instances of the modal.

### Appended to custom node

You can choose an element for the modal to be appended to, rather than using
body tag. To do this, provide a function to `parentSelector` prop that return
the element to be used.

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

### Body class

When the modal is opened a `ReactModal__Body--open` class is added to the `body` tag.
You can use this to remove scrolling on the the body while the modal is open.

```CSS
/* Remove scroll on the body when react-modal is open */
.ReactModal__Body--open {
    overflow: hidden;
}
```

## Examples

Inside an app:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      modalIsOpen: false
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  render() {
    return (
      <div>
        <button onClick={this.openModal}>Open Modal</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >

          <h2 ref={subtitle => this.subtitle = subtitle}>Hello</h2>
          <button onClick={this.closeModal}>close</button>
          <div>I am a modal</div>
          <form>
            <input />
            <button>tab navigation</button>
            <button>stays</button>
            <button>inside</button>
            <button>the modal</button>
          </form>
        </Modal>
      </div>
    );
  }
}

ReactDOM.render(<App />, appElement);
```

## Testing

When using React Test Utils with this library, here are some things to keep in mind:

- You need to set `isOpen={true}` on the modal component for it to render its children.
- You need to use the `.portal` property, as in `ReactDOM.findDOMNode(renderedModal.portal)` or `TestUtils.scryRenderedDOMComponentsWithClass(Modal.portal, 'my-modal-class')` to acquire a handle to the inner contents of your modal.

By default the modal is closed when clicking outside of it (the overlay area). If you want to prevent this behavior you can
pass the 'shouldCloseOnOverlayClick' prop with 'false' value.

```jsx
<Modal
  isOpen={bool}
  onAfterOpen={afterOpenFn}
  onRequestClose={requestCloseFn}
  closeTimeoutMS={n}
  shouldCloseOnOverlayClick={false}
  style={customStyle}
  contentLabel="No Overlay Click Modal"
>

  <h1>Force Modal</h1>
  <p>Modal cannot be closed when clicking the overlay area</p>
  <button onClick={handleCloseFunc}>Close Modal...</button>
</Modal>
```

## Demos

* http://reactjs.github.io/react-modal/
