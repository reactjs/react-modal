import React, { Component } from "react";
import Modal from "./Modal";

/**
 * DraggableModal - A wrapper around react-modal that adds drag functionality
 * 
 * FIXES ISSUE #1056: When inline style `left: 0` is applied, dragging breaks.
 * 
 * ROOT CAUSE:
 * - Draggable libraries typically modify the `left` and `top` CSS properties
 * - When you set `left: 0` as an inline style, it has higher specificity
 * - The draggable library's dynamic style updates get overridden
 * 
 * SOLUTION:
 * - Use CSS `transform: translate()` for positioning instead of left/top
 * - Transform has its own layer and doesn't conflict with left/top
 * - This allows both inline positioning AND dragging to work together
 */
class DraggableModal extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      isDragging: false,
      position: { x: 0, y: 0 },
      startPos: { x: 0, y: 0 }
    };
    
    this.contentRef = null;
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  componentDidUpdate(prevProps) {
    // Reset position when modal opens
    if (this.props.isOpen && !prevProps.isOpen) {
      this.setState({ position: { x: 0, y: 0 } });
    }
  }

  handleMouseDown = (e) => {
    const { dragHandleSelector = '.modal-drag-handle' } = this.props;
    
    // Check if click is on drag handle
    const dragHandle = e.target.closest(dragHandleSelector);
    if (!dragHandle) return;

    e.preventDefault();
    e.stopPropagation();
    
    this.setState({
      isDragging: true,
      startPos: {
        x: e.clientX - this.state.position.x,
        y: e.clientY - this.state.position.y
      }
    });
  };

  handleMouseMove = (e) => {
    if (!this.state.isDragging) return;

    e.preventDefault();

    const newX = e.clientX - this.state.startPos.x;
    const newY = e.clientY - this.state.startPos.y;

    this.setState({
      position: { x: newX, y: newY }
    });
  };

  handleMouseUp = () => {
    if (this.state.isDragging) {
      this.setState({ isDragging: false });
    }
  };

  setContentRef = (ref) => {
    this.contentRef = ref;
    if (this.props.contentRef) {
      this.props.contentRef(ref);
    }
  };

  render() {
    const { 
      style, 
      draggable = true, 
      dragHandleSelector,
      ...otherProps 
    } = this.props;
    const { position, isDragging } = this.state;

    // KEY FIX: Use transform for drag positioning
    // This doesn't conflict with inline left/top styles
    const mergedStyle = {
      ...style,
      content: {
        ...Modal.defaultStyles.content,
        ...(style?.content || {}),
        // Apply transform for dragging - works alongside left/top
        transform: draggable 
          ? `translate(${position.x}px, ${position.y}px) ${style?.content?.transform || ''}`.trim()
          : style?.content?.transform,
        // Preserve user's positioning styles (including left: 0)
        // They won't interfere with transform-based dragging
        cursor: isDragging ? 'grabbing' : (style?.content?.cursor || 'default'),
        // Prevent text selection during drag
        userSelect: isDragging ? 'none' : (style?.content?.userSelect || 'auto')
      }
    };

    return (
      <Modal
        {...otherProps}
        style={mergedStyle}
        contentRef={this.setContentRef}
        contentElement={(props, children) => (
          <div 
            {...props} 
            onMouseDown={draggable ? this.handleMouseDown : undefined}
          >
            {children}
          </div>
        )}
      />
    );
  }
}

export default DraggableModal;
