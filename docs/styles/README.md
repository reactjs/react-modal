## Styles

Styles passed into the Modal via the `style` prop are merged with the defaults.
The default styles are defined in the `Modal.defaultStyles` object and are
shown below.

```jsx
<Modal
  ...
  style={{
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.75)'
    },
    content: {
      position: 'absolute',
      top: '40px',
      left: '40px',
      right: '40px',
      bottom: '40px',
      border: '1px solid #ccc',
      background: '#fff',
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
      borderRadius: '4px',
      outline: 'none',
      padding: '20px'
    }
  }}
  ...
>
```

You can change the default styles by modifying `Modal.defaultStyles`.  Please
note that specifying a [CSS class](classes.md) for the overlay or the content
will disable the default styles for that component.
