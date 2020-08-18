# Using shouldCloseOnOverlayClick

When `shouldCloseOnOverlayClick` is `true` (default value for this property),
it requires the `onRequestClose` to be defined in order to close the <Modal/>.
This is due to the fact that the `react-modal` doesn't store the `isOpen`
on its state (only for the internal `portal` (see [ModalPortal.js](https://github.com/reactjs/react-modal/blob/master/src/components/ModalPortal.js)).

[disable 'close on overlay click', codepen by claydiffrient](https://codepen.io/claydiffrient/pen/woLzwo)

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="js,result" data-user="claydiffrient" data-slug-hash="woLzwo" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="React Modal - shouldCloseOnOverlayClick">
  <span>See the Pen <a href="https://codepen.io/claydiffrient/pen/woLzwo">
  React Modal - shouldCloseOnOverlayClick</a> by claydiffrient (<a href="https://codepen.io/claydiffrient">@claydiffrient</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

[enable 'close on overlay click', codepen by sbgriffi](https://codepen.io/sbgriffi/pen/WMyBaR)

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="js,result" data-user="sbgriffi" data-slug-hash="WMyBaR" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="React Modal - shouldCloseOnOverlayClick">
  <span>See the Pen <a href="https://codepen.io/sbgriffi/pen/WMyBaR">
  React Modal - shouldCloseOnOverlayClick</a> by Stuart (<a href="https://codepen.io/sbgriffi">@sbgriffi</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
