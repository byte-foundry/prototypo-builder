import React, { Component } from 'react';

export default class SvgSelector extends Component {

  handleMouseDown() {
    this.props.updateProp(this.props.point.id, 'selected', true);
    window.addEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  handleMouseUp() {
    this.props.updateProp(this.props.point.id, 'selected', false);
  }

  render() {
    return (
        <circle onMouseDown={this.handleMouseDown.bind(this)} className={this.props.className} cx={this.props.point.x || '0'} cy={this.props.point.y || '0'} r='10'></circle>
    );
  }
}
