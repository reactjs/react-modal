# Quick Fix for Issue #1056

## TL;DR

**Problem**: `left: 0` inline style breaks modal dragging  
**Cause**: Inline styles override dynamic drag positioning  
**Solution**: Use `transform: translate()` instead of `left`/`top` for drag positioning

## Copy-Paste Solution

### Option 1: Use the New DraggableModal Component

```jsx
import { DraggableModal } from 'react-modal';

<DraggableModal
  isOpen={isOpen}
  onRequestClose={closeModal}
  style={{
    content: {
      left: 0,  // ✅ Now works!
      top: '50%',
      width: '500px'
    }
  }}
  draggable={true}
  dragHandleSelector=".modal-header"
>
  <div className="modal-header">Drag me!</div>
  <div>Content</div>
</DraggableModal>
```

### Option 2: Apply the Fix to Your Existing Draggable Implementation

If you're using `react-draggable` or similar:

**Before (Broken):**
```jsx
<Draggable>
  <Modal style={{ content: { left: 0 } }}>
    Content
  </Modal>
</Draggable>
```

**After (Fixed):**
```jsx
<Draggable
  position={position}
  onDrag={(e, data) => setPosition({ x: data.x, y: data.y })}
>
  <Modal 
    style={{ 
      content: { 
        left: 0,  // Keep your inline style
        transform: `translate(${position.x}px, ${position.y}px)`  // Add this
      } 
    }}
  >
    Content
  </Modal>
</Draggable>
```

## Why This Works

| Approach | Result |
|----------|--------|
| Modify `left` property | ❌ Overridden by inline `left: 0` |
| Modify `transform` property | ✅ Independent, no conflict |

## Files Added

1. `src/components/DraggableModal.js` - New draggable modal component
2. `examples/draggable/app.js` - Working example
3. `examples/draggable/index.html` - Example HTML
4. `DRAGGABLE_MODAL_FIX.md` - Full documentation

## Test It

```bash
npm start
# Navigate to http://127.0.0.1:8080/draggable/
```

Toggle the "Apply left: 0" checkbox to see it works both ways!
