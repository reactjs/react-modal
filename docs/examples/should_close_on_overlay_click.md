# Using shouldCloseOnOverlayClick

When `shouldCloseOnOverlayClick` is `true` (default value for this property),
it requires the `onRequestClose` to be defined in order to close the <Modal/>.
This is due to the fact that the `react-modal` doesn't store the `isOpen`
on its state (only for the internal `portal` (see [ModalPortal.js](https://github.com/reactjs/react-modal/blob/master/src/components/ModalPortal.js)).

[shouldCloseOnOverlayClick example](https://codepen.io/neilhsmith/pen/wvEYxKa)
