# Testing

When using React Test Utils with this library, here are some things to keep in mind:

- You need to set `isOpen={true}` on the modal component for it to render its children.
- You need to use the `.portal` property, as in `ReactDOM.findDOMNode(renderedModal.portal)` or `TestUtils.scryRenderedDOMComponentsWithClass(Modal.portal, 'my-modal-class')` to acquire a handle to the inner contents of your modal.
