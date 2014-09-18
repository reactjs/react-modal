/** @jsx React.DOM */

var React = require('react');

var Modal = module.exports = React.createClass({

  displayName: 'Modal',

  propTypes: {
  },

  getDefaultProps: function () {
    return {
    };
  },

  render: function () {
    return <div>{this.props.children}</div>
  }

});

