### Global Overrides

If you'd like to override all instances of modals you can make changes to `Modal.defaultStyles`.

`Modal.defaultStyles` looks like this : 

```
{
  "overlay": {
    "position": "fixed",
    "top": 0,
    "left": 0,
    "right": 0,
    "bottom": 0,
    "backgroundColor": "rgba(255, 255, 255, 0.75)",
    "zIndex": 10
  },
  "content": {
    "position": "absolute",
    "top": "40px",
    "left": "50%",
    "right": "40px",
    "bottom": "40px",
    "border": "1px solid #ccc",
    "background": "#fff",
    "overflow": "auto",
    "WebkitOverflowScrolling": "touch",
    "borderRadius": "4px",
    "outline": "none",
    "padding": "20px",
    "width": 400,
    "height": 400,
    "marginLeft": -200
  }
}
```

You can override the styles for either the _content_ or the wrapping _overlay_ .
