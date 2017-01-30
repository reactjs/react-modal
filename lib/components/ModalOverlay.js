import React, { Component, PropTypes } from 'react';

export default class ModalOverlay extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
    onMouseDown: PropTypes.func,
    onMouseUp: PropTypes.func,
    children: PropTypes.element
  };

  static defaultProps = {
    style: {},
  };

  render () {
    const { children, ...restProps } = this.props;

    return (
      <div {...restProps}>
        {children}
      </div>
    );
  }
}
