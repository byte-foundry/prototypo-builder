import React, { Component } from 'react';

import {
  MOUSE_STATE_MOVE,
  MOUSE_STATE_CREATE,
  ONCURVE_CORNER,
  ONCURVE_SMOOTH
} from '../../actions/const';

import {
  getSvgCoordsFromClientCoords
} from '../../containers/svg/_utils';

import {
  getNode
} from '../../_utils/pathWalkers';

export default class SvgSelector extends Component {
  constructor(props) {
    super(props);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  handleMouseDown(e) {
    e.stopPropagation();
    this.props.setMouseState(MOUSE_STATE_MOVE);
    this.props.setNodeSelected(this.props.point.id, this.props.parentId);
    const svgCoord = getSvgCoordsFromClientCoords({
      x: e.clientX,
      y: e.clientY
    }, this.refs.el);
    this.props.setCoords(svgCoord.x, svgCoord.y);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  handleDoubleClick(e) {
    if (this.props.point.type === 'oncurve') {
      if (this.props.point.state === ONCURVE_CORNER) {
        const node = getNode(this.props.parentId, this.props.point.id, this.props.nodes);
        const handleToMove = node[2];
        const handleRef = node[1];
        if (node[1] && node[2]) {
          const newPos = {
            x: 2 * this.props.point.x - handleRef.x,
            y: 2 * this.props.point.y - handleRef.y
          }

          const displacementVec = {
            dx: newPos.x - handleToMove.x,
            dy: newPos.y - handleToMove.y,
          }

          this.props.moveNode(handleToMove.id, this.props.parentId, displacementVec);
        }
      }
      this.props.updateProp(this.props.point.id, 'state', this.props.point.state === ONCURVE_CORNER ? ONCURVE_SMOOTH : ONCURVE_CORNER);
    }
  }

  handleMouseUp(e) {
    this.props.setMouseState(MOUSE_STATE_CREATE);
    window.removeEventListener('mouseup', this.handleMouseUp);
    this.props.setNodeSelected();
  }

  render() {
    let indicator = false;
    if (this.props.point.type === 'oncurve') {
      if (this.props.point.state === ONCURVE_SMOOTH) {
        const path = `M${this.props.point.x - 20} ${this.props.point.y + 20} L${this.props.point.x - 20} ${this.props.point.y + 60}`;
        indicator = <g className="state-indicator">
          <path d={path}/>
          <circle className="state-indicator-circle"
            cx={this.props.point.x - 20}
            cy={this.props.point.y + 40}
            r='5'/>
        </g>
      }
      else {
        const path = `M${this.props.point.x - 30} ${this.props.point.y + 20}
          L${this.props.point.x - 20} ${this.props.point.y + 60}
          L${this.props.point.x - 10} ${this.props.point.y + 20}`;
        indicator = <g className="state-indicator">
          <path d={path} />
          <circle className="state-indicator-circle"
            cx={this.props.point.x - 20}
            cy={this.props.point.y + 60}
            r='5'/>
        </g>
      }
    }
    return (
      <g className="selector-container">
        <circle
          ref="el"
          className={this.props.className}
          cx={this.props.point.x || '0'}
          cy={this.props.point.y || '0'}
          r='5'></circle>
        <circle
          ref="el"
          onDoubleClick={this.handleDoubleClick.bind(this)}
          onMouseDown={this.handleMouseDown.bind(this)}
          className="transparent-selector"
          cx={this.props.point.x || '0'}
          cy={this.props.point.y || '0'}
          r='20'></circle>
        {indicator}
      </g>
    );
  }
}
