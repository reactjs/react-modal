### CSS Classes

Sometimes it may be preferable to use CSS classes rather than inline styles.
react-modal can be configured to use CSS classes to style the modal content and
overlay, as well as the document body and the portal within which the modal is
mounted.

#### For the content and overlay

You can use the `className` and `overlayClassName` props to control the CSS
classes that are applied to the modal content and the overlay, respectively.
Each of these props may be a single string containing the class name to apply
to the component.

Alternatively, you may pass an object with the `base`, `afterOpen` and
`beforeClose` keys, where the value corresponding to each key is a class name.
The `base` class will always be applied to the component, the `afterOpen` class
will be applied after the modal has been opened and the `beforeClose` class
will be applied after the modal has requested to be closed (e.g. when the user
presses the escape key or clicks on the overlay).

Please note that the `beforeClose` class will have no effect unless the
`closeTimeoutMS` prop is set to a non-zero value, since otherwise the modal
will be closed immediately when requested.  Thus, if you are using the
`afterOpen` and `beforeClose` classes to provide transitions, you may want to
set `closeTimeoutMS` to the length (in milliseconds) of your closing
transition.

If you specify `className`, the [default content styles](README.md) will not be
applied.  Likewise, if you specify `overlayClassName`, the default overlay
styles will not be applied.

If no class names are specified for the overlay, the default classes
`ReactModal__Overlay`, `ReactModal__Overlay--after-open` and
`ReactModal__Overlay--before-close` will be applied; the default classes for
the content use the analogous prefix `ReactModal__Content`.  Please note that
any styles applied using these default classes will not override the default
styles as they would if specified using the `className` or `overlayClassName`
props.

#### For the document.body and html tag

You can override the default class that is added to `document.body` when the
modal is open by defining a property `bodyOpenClassName`.

The `bodyOpenClassName` prop must be a *constant string*; otherwise, we would
require a complex system to manage which class name should be added to or
removed from `document.body` from which modal (if using multiple modals
simultaneously).  The default value is `ReactModal__Body--open`.

`bodyOpenClassName` can support adding multiple classes to `document.body` when
the modal is open. Add as many class names as you desire, delineated by spaces.

One potential application for the body class is to remove scrolling on the body
when the modal is open.  To do this for all modals (except those that specify a
non-default `bodyOpenClassName`), you could use the following CSS:

```CSS
.ReactModal__Body--open {
    overflow: hidden;
}
```

You can define a class to be added to the html tag, using the `htmlOpenClassName`
attribute, which can be helpeful to stop the page to scroll to the top when open
a modal.

This attribute follows the same rules as `bodyOpenClassName`, it must be a *constant string*;

Here is an example that can help preventing this behavior:

```CSS
.ReactModal__Body--open,
.ReactModal__Html--open {
  overflow: hidden;
}
```

#### For the entire portal

To specify a class to be applied to the entire portal, you may use the
`portalClassName` prop.  By default, there are no styles applied to the portal
itself.
