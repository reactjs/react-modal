# Using shouldCloseOnOverlayClick

This example shows using `shouldCloseOnOverlayClick` set to `false` so that closing by clicking on the overlay doesn't work.

`shouldCloseOnOverlayClick` requires `onRequestClose` in order to close the <Modal/> because `react-modal` does not store `isOpen` in its local state.

[](codepen://claydiffrient/woLzwo)
