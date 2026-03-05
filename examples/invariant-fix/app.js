import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Modal from '../../src/components/Modal';

const appElement = document.getElementById('example');
Modal.setAppElement(appElement);

/**
 * Test cases for Invariant Violation fixes
 * All these scenarios previously could cause "Invariant Violation" errors
 * Now they all work safely with proper fallbacks
 */
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scenario: null
    };
  }

  openScenario = (scenario) => {
    this.setState({ scenario });
  }

  closeModal = () => {
    this.setState({ scenario: null });
  }

  render() {
    const { scenario } = this.state;

    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Invariant Violation Fix - Test Cases</h1>
        <p>All these scenarios are now safe and won't cause "Invariant Violation" errors:</p>

        <div style={{ display: 'grid', gap: '10px', marginTop: '20px' }}>
          {/* Scenario 1: No children */}
          <button 
            onClick={() => this.openScenario('no-children')}
            style={buttonStyle}
          >
            Test 1: Modal with No Children
          </button>

          {/* Scenario 2: Undefined children */}
          <button 
            onClick={() => this.openScenario('undefined-children')}
            style={buttonStyle}
          >
            Test 2: Modal with Undefined Children
          </button>

          {/* Scenario 3: Invalid contentElement */}
          <button 
            onClick={() => this.openScenario('invalid-content-element')}
            style={buttonStyle}
          >
            Test 3: Invalid contentElement Function
          </button>

          {/* Scenario 4: Invalid overlayElement */}
          <button 
            onClick={() => this.openScenario('invalid-overlay-element')}
            style={buttonStyle}
          >
            Test 4: Invalid overlayElement Function
          </button>

          {/* Scenario 5: Throwing contentElement */}
          <button 
            onClick={() => this.openScenario('throwing-content-element')}
            style={buttonStyle}
          >
            Test 5: Throwing contentElement Function
          </button>

          {/* Scenario 6: Normal modal (control) */}
          <button 
            onClick={() => this.openScenario('normal')}
            style={{ ...buttonStyle, background: '#52c41a' }}
          >
            Test 6: Normal Modal (Control)
          </button>
        </div>

        {/* Scenario 1: No children - FIXED */}
        <Modal
          isOpen={scenario === 'no-children'}
          onRequestClose={this.closeModal}
          contentLabel="No Children Test"
        >
          {/* Intentionally empty - this is now safe */}
        </Modal>

        {/* Scenario 2: Undefined children - FIXED */}
        <Modal
          isOpen={scenario === 'undefined-children'}
          onRequestClose={this.closeModal}
          contentLabel="Undefined Children Test"
        >
          {undefined}
        </Modal>

        {/* Scenario 3: Invalid contentElement - FIXED */}
        <Modal
          isOpen={scenario === 'invalid-content-element'}
          onRequestClose={this.closeModal}
          contentLabel="Invalid contentElement Test"
          contentElement={() => undefined} // Returns undefined - now safe!
        >
          <div style={modalContentStyle}>
            <h2>✅ Invalid contentElement Fixed!</h2>
            <p>The contentElement function returned undefined, but we used a safe fallback.</p>
            <button onClick={this.closeModal} style={closeButtonStyle}>Close</button>
          </div>
        </Modal>

        {/* Scenario 4: Invalid overlayElement - FIXED */}
        <Modal
          isOpen={scenario === 'invalid-overlay-element'}
          onRequestClose={this.closeModal}
          contentLabel="Invalid overlayElement Test"
          overlayElement={() => false} // Returns false - now safe!
        >
          <div style={modalContentStyle}>
            <h2>✅ Invalid overlayElement Fixed!</h2>
            <p>The overlayElement function returned false, but we used a safe fallback.</p>
            <button onClick={this.closeModal} style={closeButtonStyle}>Close</button>
          </div>
        </Modal>

        {/* Scenario 5: Throwing contentElement - FIXED */}
        <Modal
          isOpen={scenario === 'throwing-content-element'}
          onRequestClose={this.closeModal}
          contentLabel="Throwing contentElement Test"
          contentElement={() => {
            throw new Error("Intentional error for testing");
          }}
        >
          <div style={modalContentStyle}>
            <h2>✅ Throwing Function Fixed!</h2>
            <p>The contentElement function threw an error, but we caught it and used a safe fallback.</p>
            <p><em>Check the console for the error message (development mode only).</em></p>
            <button onClick={this.closeModal} style={closeButtonStyle}>Close</button>
          </div>
        </Modal>

        {/* Scenario 6: Normal modal - Control */}
        <Modal
          isOpen={scenario === 'normal'}
          onRequestClose={this.closeModal}
          contentLabel="Normal Modal"
        >
          <div style={modalContentStyle}>
            <h2>✅ Normal Modal</h2>
            <p>This is a normal modal with proper children. It works as expected.</p>
            <button onClick={this.closeModal} style={closeButtonStyle}>Close</button>
          </div>
        </Modal>

        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          background: '#f0f0f0', 
          borderRadius: '8px' 
        }}>
          <h3>Current Test: {scenario || 'None'}</h3>
          <p>
            {scenario === 'no-children' && '✅ Modal with no children renders safely'}
            {scenario === 'undefined-children' && '✅ Modal with undefined children renders safely'}
            {scenario === 'invalid-content-element' && '✅ Invalid contentElement uses fallback'}
            {scenario === 'invalid-overlay-element' && '✅ Invalid overlayElement uses fallback'}
            {scenario === 'throwing-content-element' && '✅ Throwing function caught and handled'}
            {scenario === 'normal' && '✅ Normal modal works perfectly'}
            {!scenario && 'Click a button above to test a scenario'}
          </p>
        </div>

        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          background: '#e6f7ff', 
          border: '1px solid #91d5ff',
          borderRadius: '4px' 
        }}>
          <h4>✅ All Fixes Applied:</h4>
          <ul>
            <li>Children validation (undefined → null)</li>
            <li>contentElement function validation</li>
            <li>overlayElement function validation</li>
            <li>Try-catch error handling</li>
            <li>Safe fallback elements</li>
            <li>Development mode warnings</li>
          </ul>
        </div>
      </div>
    );
  }
}

const buttonStyle = {
  padding: '12px 20px',
  background: '#1890ff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  textAlign: 'left'
};

const modalContentStyle = {
  padding: '20px',
  maxWidth: '500px'
};

const closeButtonStyle = {
  marginTop: '20px',
  padding: '8px 16px',
  background: '#fff',
  border: '1px solid #d9d9d9',
  borderRadius: '4px',
  cursor: 'pointer'
};

ReactDOM.render(<App />, appElement);
