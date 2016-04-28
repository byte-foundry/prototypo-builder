import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import SvgRoot from './SvgRoot';

import {
  mapDispatchToProps,
  getSvgCoordsFromClientCoords
} from './_utils';

import {
  MOUSE_STATE_CREATE,
  MOUSE_STATE_MOVE_AFTER_CREATE
} from '../../actions/const';

class SvgContainer extends Component {
  constructor(props) {
    super(props);
    this.handleDown = this.handleDown.bind(this);
  }

  handleDown(e) {
    if (this.props.ui.uiState === MOUSE_STATE_CREATE) {
      const {
        createOffcurve,
        addOffcurve,
        createOncurve,
        addOncurve,
        updateProp
      } = this.props.actions;

      const point = getSvgCoordsFromClientCoords({
        x: e.clientX,
        y: e.clientY
      }, this.refs.svg);

      const offcurve1Id = createOffcurve().nodeId;
      const offcurve2Id = createOffcurve().nodeId;
      const oncurveId = createOncurve().nodeId;

      updateProp(offcurve1Id, 'x', point.x);
      updateProp(offcurve1Id, 'y', point.y);
      updateProp(oncurveId, 'x', point.x);
      updateProp(oncurveId, 'y', point.y);
      updateProp(offcurve2Id, 'x', point.x);
      updateProp(offcurve2Id, 'y', point.y);

      addOffcurve('path-initial', offcurve1Id);
      addOncurve('path-initial', oncurveId);
      addOffcurve('path-initial', offcurve2Id);

      const svgCoord = getSvgCoordsFromClientCoords({
        x: e.clientX,
        y: e.clientY
      }, this.refs.svg);
      this.props.actions.setCoords(svgCoord.x, svgCoord.y);
      this.props.actions.setNodeSelected(offcurve2Id, 'path-initial');
      this.props.actions.setMouseState(MOUSE_STATE_MOVE_AFTER_CREATE);
    }
  }

  handleMove(e) {
    const pointToMove = this.props.nodes[this.props.ui.selected.point];
    const parentPoint = this.props.nodes[this.props.ui.selected.parent];
    if (pointToMove) {
      const svgCoord = getSvgCoordsFromClientCoords({
        x: e.clientX,
        y: e.clientY
      }, this.refs.svg);
      const move = {
        dx: svgCoord.x - this.props.ui.mouse.x,
        dy: svgCoord.y - this.props.ui.mouse.y
      }
      this.props.actions.moveNode(pointToMove.id, parentPoint.id, move);
      this.props.actions.setCoords(svgCoord.x, svgCoord.y);
    }
  }

  handleUp() {
    if (this.props.ui.uiState === MOUSE_STATE_MOVE_AFTER_CREATE) {
      this.props.actions.setMouseState(MOUSE_STATE_CREATE);
      this.props.actions.setNodeSelected();
    }
  }

  render() {
    return (
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
        onMouseMove={this.handleMove.bind(this)}
        onMouseUp={this.handleUp.bind(this)}
        viewBox="-800 -1400 2000 2000" onMouseDown={this.handleDown}
      >
        <g ref="svg" transform="matrix(1 0 0 -1 0 0)">
          <SvgRoot id={'root'} />
        </g>
      </svg>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

SvgContainer.propTypes = {
  actions: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(SvgContainer);
