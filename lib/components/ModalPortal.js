/** @jsx React.DOM */

var React = require('react');
var findTabbable = require('../helpers/tabbable');

function stopPropagation(event) {
  event.stopPropagation();
}

var ModalPortal = module.exports = React.createClass({

  displayName: 'ModalPortal',

  getInitialState: function() {
    return {
      isOpen: this.props.isOpen,
      afterOpen: false,
      beforeClose: false
    };
  },

  componentWillReceiveProps: function(newProps) {
    if (newProps.isOpen === false && this.props.isOpen === true) {
      this.startClose();
    }
    else {
      this.setState({isOpen: newProps.isOpen}, function() {
        if (this.state.isOpen)
          this.setState({afterOpen: true});
      }.bind(this));
    }
  },

  componentDidMount: function() {
    this.maybeFocus();
  },

  componentDidUpdate: function() {
    this.maybeFocus();
  },

  maybeFocus: function() {
    if (this.state.isOpen)
      this.focusContent();
  },

  focusContent: function() {
    this.refs.content.getDOMNode().focus();
  },

  handleOverlayClick: function() {
    if (this.props.dismissable)
      this.startClose();
    else
      this.focusContent();
  },

  startClose: function() {
    if (this.props.closeTimeoutMS > 0)
      this.closeWithTimeout();
    else
      this.close();
  },

  closeWithTimeout: function() {
    this.setState({beforeClose: true}, function() {
      setTimeout(this.close, this.props.closeTimeoutMS);
    }.bind(this));
  },

  close: function() {
    this.setState({
      isOpen: false,
      afterOpen: false,
      beforeClose: false
    }, this.notifyClosed);
  },

  notifyClosed: function() {
    if (this.props.onClose) this.props.onClose();
    // this.returnFocusToOwner()
  },

  keepTabNavInside: function(event) {
    var node = this.getDOMNode();
    var tabbable = findTabbable(node);
    var finalTabbable = tabbable[event.shiftKey ? 0 : tabbable.length - 1];
    var leavingFinalTabbable = (
      finalTabbable === document.activeElement ||
      // handle immediate shift+tab after opening with mouse
      node === document.activeElement
    );
    if (!leavingFinalTabbable) return;
    event.preventDefault();
    var target = tabbable[event.shiftKey ? tabbable.length - 1 : 0];
    target.focus();
  },

  handleKeyDown: function(event) {
    if (event.keyCode == 9 /*tab*/) this.keepTabNavInside(event);
    if (this.props.dismissable && event.keyCode == 27 /*esc*/) this.startClose();
  },

  render: function() {
    if (!this.state.isOpen) {
      return <div/>;
    }
    else {
      var style = {position: 'fixed', left: 0, right: 0, top: 0, bottom: 0};
      var overlayClassName = 'ReactModal__Overlay';
      var contentClassName = 'ReactModal__Content';
      if (this.state.afterOpen) {
        overlayClassName += ' ReactModal__Overlay--after-open';
        contentClassName += ' ReactModal__Content--after-open';
      }
      if (this.state.beforeClose) {
        overlayClassName += ' ReactModal__Overlay--before-close';
        contentClassName += ' ReactModal__Content--before-close';
      }
      return (
        <div
          className={overlayClassName}
          style={style}
          onClick={this.handleOverlayClick}
        >
          <div
            onClick={stopPropagation}
            ref="content"
            onKeyDown={this.handleKeyDown}
            className={contentClassName}
            tabIndex="-1"
          >
            {this.props.children}
          </div>
        </div>
      );
    }
  }

});

