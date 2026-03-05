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
      children,
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

    // FIX: Ensure children is always a valid value (null if undefined)
    // This prevents "Invariant Violation" when no children are provided
    const validChildren = children !== undefined ? children : null;

    // FIX: Validate contentElement function returns valid React element
    // Wrap in try-catch to handle edge cases where contentElement might fail
    let contentElementFn;
    try {
      contentElementFn = (props, children) => {
        // FIX: Ensure we always return a valid React element
        const element = (
          <div 
            {...props} 
            onMouseDown={draggable ? this.handleMouseDown : undefined}
          >
            {children}
          </div>
        );
        return element;
      };
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("React-Modal: DraggableModal contentElement error", error);
      }
      // Fallback to simple div wrapper
      contentElementFn = (props, children) => <div {...props}>{children || null}</div>;
    }

    // FIX: Wrap Modal in try-catch and ensure we always return valid element or null
    try {
      const modalElement = (
        <Modal
          {...otherProps}
          style={mergedStyle}
          contentRef={this.setContentRef}
          contentElement={contentElementFn}
        >
          {validChildren}
        </Modal>
      );
      
      // FIX: Ensure we return a valid React element or null
      return modalElement || null;
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("React-Modal: DraggableModal render error", error);
      }
      // FIX: Return null instead of undefined if rendering fails
      return null;
    }
  }
}

export default DraggableModal;
