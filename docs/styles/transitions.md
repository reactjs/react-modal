### Transitions

Using [CSS classes](classes.md), it is possible to implement transitions for
when the modal is opened or closed.  By placing the following CSS somewhere in
your project's styles, you can make the modal content fade in when it is opened
and fade out when it is closed:

```css
.ReactModal__Content {
  opacity: 0;
}

.ReactModal__Content--after-open {
  opacity: 1;
  transition: opacity 150ms;
}

.ReactModal__Content--before-close {
  opacity: 0;
}
```

In order for the close transition to take effect, you will also need to pass
the `closeTimeoutMS={150}` prop to each of your modals.

The above example will apply the fade transition globally, affecting all modals
whose `afterOpen` and `beforeClose` classes have not been set via the
`className` prop.  To apply the transition to one modal only, you can change
the above class names and pass an object to your modal's `className` prop as
described in the [previous section](classes.md).
