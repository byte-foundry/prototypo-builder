import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import {
  ONCURVE_SMOOTH,
  SELECTION_MODE
} from '../../actions/const';

import {
  getNode,
  getPreviousNode,
  getNextNode
} from '../../_utils/path';

import {
  mapDispatchToProps,
  equalVec,
  normalizeVec,
  getDerivative,
  multiplyVecByN,
  addVec,
  dist
} from './_utils';

class SvgSelector extends Component {
  constructor(props) {
    super(props);
  }

  componentWillUpdate() {
    let handlePoint = this.props.point;
    if (this.props.source && equalVec(this.props.source, handlePoint) && !handlePoint._isGhost) {
      const [point, pointIn, pointOut] = getNode(this.props.parent, this.props.source.id, this.props.nodes);
      if (this.props.type === 'in') {
        const [target, unused, targetOut] = getPreviousNode(this.props.parent, this.props.source.id, this.props.nodes);

        if (target) {
          // TODO: ghost handles are calculated and should be removed from the state
          const derivative = getDerivative(target, targetOut, pointIn, point, 2 / 3);
          const normalizedD = normalizeVec(derivative);
          const ghostVec = multiplyVecByN(normalizedD, -dist(target, point) / 3);

          const ghostHandlePoint = addVec(this.props.source, ghostVec);
          this.props.actions.updateProp(this.props.point.id, '_ghost', {
            x: ghostHandlePoint.x,
            y: ghostHandlePoint.y
          });
          this.props.actions.updateProp(this.props.point.id, '_isGhost', true);
        }
      } else if (this.props.type === 'out') {
        const [target, targetIn] = getNextNode(this.props.parent, this.props.source.id, this.props.nodes);
        if (target) {
          const derivative = getDerivative(point, pointOut, targetIn, target, 1 / 3);
          const normalizedD = normalizeVec(derivative);
          const ghostVec = multiplyVecByN(normalizedD, dist(target, point) / 3);
          const ghostHandlePoint = addVec(this.props.source, ghostVec);
          this.props.actions.updateProp(this.props.point.id, '_ghost', {
            x: ghostHandlePoint.x,
            y: ghostHandlePoint.y
          });
          this.props.actions.updateProp(this.props.point.id, '_isGhost', true);
        }
      }
    }
  }

  render() {
    let indicator = false;
    if (this.props.point.type === 'oncurve' && this.props.hovered === this.props.point.id) {
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

    const handlePoint = this.props.point._isGhost ? this.props.point._ghost : this.props.point;

    const path = this.props.source
      ? <path className="point-control" key={`${this.props.parent}-point-in-${this.props.source.id}`} d={`M${this.props.source.x} ${this.props.source.y} L${handlePoint.x} ${handlePoint.y}`}/>
      : false;


    const classes = classnames({
      [this.props.className]: true,
      'is-hovered': this.props.hovered === this.props.point.id
    });

    const selectionIndicator = this.props.mode === SELECTION_MODE && this.props.point.id === this.props.hovered
      ? <circle
          style={{fill: 'transparent', stroke: 'red'}}
          cx={handlePoint.x}
          cy={handlePoint.y}
          r='20'/>
      : false;

    return (
      <g className="selector-container">
        {path}
        <circle
          ref="el"
          className={classes}
          cx={handlePoint.x || '0'}
          cy={handlePoint.y || '0'}
          r='5'></circle>
        {selectionIndicator}
        {indicator}
      </g>
    );
  }
}

SvgSelector.propTypes = {
  actions: PropTypes.object.isRequired
}

function mapStateToProps(state, ownProps) {
  return { mode: state.ui.uiState, hovered: state.ui.hovered.point};
}

export default connect(mapStateToProps, mapDispatchToProps)(SvgSelector);
