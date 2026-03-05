import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DraggableModal from '../../src/components/DraggableModal';

const appElement = document.getElementById('example');

DraggableModal.setAppElement(appElement);

/**
 * Example demonstrating the fix for issue #1056
 * 
 * PROBLEM: When left: 0 is applied as inline style, dragging doesn't work
 * SOLUTION: Use transform-based positioning instead of left/top manipulation
 */
class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      modalIsOpen: false,
      useLeftZero: true 
    };
  }

  openModal = () => {
    this.setState({ modalIsOpen: true });
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  }

  toggleLeftZero = () => {
    this.setState({ useLeftZero: !this.state.useLeftZero });
  }

  render() {
    const { modalIsOpen, useLeftZero } = this.state;

    // This is the problematic style that breaks dragging in other implementations
    const modalStyle = {
      content: {
        top: '50%',
        left: useLeftZero ? 0 : '50%', // Issue #1056: left: 0 breaks dragging
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        padding: '0'
      }
    };

    return (
      <div style={{ padding: '20px' }}>
        <h1>Draggable Modal - Fix for Issue #1056</h1>
        
        <div style={{ marginBottom: '20px' }}>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={this.openModal}
            aria-label="Open Draggable Modal"
          >
            Open Draggable Modal
          </button>
          
          <label style={{ marginLeft: '20px' }}>
            <input 
              type="checkbox" 
              checked={useLeftZero}
              onChange={this.toggleLeftZero}
            />
            {' '}Apply left: 0 (Issue #1056)
          </label>
        </div>

        <div style={{ 
          padding: '15px', 
          background: '#f0f0f0', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <h3>Current Style:</h3>
          <pre style={{ background: '#fff', padding: '10px', borderRadius: '4px' }}>
            {JSON.stringify(modalStyle.content, null, 2)}
          </pre>
          <p>
            <strong>Status:</strong> {useLeftZero 
              ? '❌ left: 0 applied (would break dragging in unfixed version)' 
              : '✅ left: 50% applied (normal centering)'}
          </p>
        </div>

        <DraggableModal
          isOpen={modalIsOpen}
          onRequestClose={this.closeModal}
          style={modalStyle}
          contentLabel="Draggable Modal Example"
          draggable={true}
          dragHandleSelector=".modal-drag-handle"
        >
          <div style={{ 
            background: '#fff', 
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            {/* Drag Handle */}
            <div 
              className="modal-drag-handle"
              style={{
                padding: '15px 20px',
                background: '#1890ff',
                color: '#fff',
                cursor: 'grab',
                userSelect: 'none',
                borderBottom: '1px solid #e8e8e8'
              }}
            >
              <h2 style={{ margin: 0, fontSize: '18px' }}>
                🎯 Drag me by this header
              </h2>
              <p style={{ margin: '5px 0 0 0', fontSize: '12px', opacity: 0.9 }}>
                Click and drag this blue area to move the modal
              </p>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '20px' }}>
              <h3>Issue #1056 - FIXED! ✅</h3>
              
              <p>
                <strong>Problem:</strong> When <code>left: 0</code> is applied as an inline style,
                dragging doesn't work because the inline style has higher specificity than
                the dynamically updated styles from the drag handler.
              </p>

              <p>
                <strong>Solution:</strong> Use CSS <code>transform: translate()</code> for drag
                positioning instead of modifying <code>left</code> and <code>top</code> properties.
                Transform operates independently and doesn't conflict with inline positioning styles.
              </p>

              <div style={{ 
                background: '#f6ffed', 
                border: '1px solid #b7eb8f',
                padding: '15px',
                borderRadius: '4px',
                marginTop: '15px'
              }}>
                <h4 style={{ marginTop: 0 }}>✅ What Works Now:</h4>
                <ul style={{ marginBottom: 0 }}>
                  <li>Dragging works with <code>left: 0</code></li>
                  <li>Dragging works with <code>left: 50%</code></li>
                  <li>Dragging works with any inline positioning</li>
                  <li>All original modal functionality preserved</li>
                </ul>
              </div>

              <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <button 
                  type="button"
                  onClick={this.closeModal}
                  style={{
                    padding: '8px 16px',
                    background: '#fff',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  aria-label="Close Modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </DraggableModal>
      </div>
    );
  }
}

ReactDOM.render(<App />, appElement);
