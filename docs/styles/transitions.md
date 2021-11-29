Using [CSS classes](classes.md), it is possible to implement transitions for
when the modal is opened or closed.  By placing the following CSS somewhere in
your project's styles, you can make the modal content fade in when it is opened
and fade out when it is closed:

```css
.ReactModal__Overlay {
    opacity: 0;
    transition: opacity 2000ms ease-in-out;
}

.ReactModal__Overlay--after-open{
    opacity: 1;
}

.ReactModal__Overlay--before-close{
    opacity: 0;
}
```


The above example will apply the fade transition globally, affecting all modals
whose `afterOpen` and `beforeClose` classes have not been set via the
`className` prop.  To apply the transition to one modal only, you can change
the above class names and pass an object to your modal's `className` prop as
described in the [previous section](classes.md).

In order for the fade transition to work, you need to inform the `<Modal />` about the transition time required for the animation.

Like this

```javascript
<Modal closeTimeoutMS={2000} />
```

`closeTimeoutMS` is expressed in milliseconds.

The `closeTimeoutMS` value and the value used in CSS or `style` prop passed to `<Modal />` needs to be the same.

Warning: if you are using **React 16**, the close transition works [only if you use](https://github.com/reactjs/react-modal/issues/530#issuecomment-335208533) the `isOpen` prop to toggle the visibility of the modal.

Do not conditionally render the `<Modal />`.

Instead of this

```javascript
{
  this.state.showModal &&
  <Modal
    closeTimeoutMS={200}
    isOpen
    contentLabel="modal"
    onRequestClose={() => this.toggleModal()}
  >
    <h2>Add modal content here</h2>
  </Modal>
}
```

*Do this*

```javascript
{
  <Modal
    closeTimeoutMS={200}
    isOpen={this.state.showModal}
    contentLabel="modal"
    onRequestClose={() => this.toggleModal()}
  >
    <h2>Add modal content here</h2>
  </Modal>
}
```

React Modal has adopted the [stable Portal API](https://reactjs.org/docs/portals.html) as exposed in React 16.

And `createProtal` API from React 16 [no longer allow](https://github.com/facebook/react/issues/10826#issuecomment-355719729) developers to intervene the unmounting of the portal component.
