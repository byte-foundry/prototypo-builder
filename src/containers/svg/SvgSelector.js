import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import Bezier from 'bezier-js/fp';

import * as Path from '~/_utils/Path';
import * as Vector from '~/_utils/Vector';
import {
  ONCURVE_SMOOTH,
  SELECTION_MODE,
} from '~/const';

import { mapDispatchToProps } from './_utils';

class SvgSelector extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentWillUpdate() {
    let handlePoint = this.props.point;

    if (this.props.source && Vector.isEqual(this.props.source, handlePoint) && !handlePoint._isGhost) {
      const [point, pointIn, pointOut] = Path.getNode(this.props.parent, this.props.source.id, this.props.nodes);

      if (this.props.type === 'in') {
        const [target, , targetOut] = Path.getPrevNode(this.props.parent, this.props.source.id, this.props.nodes);

        if (target) {
          // TODO: ghost handles are calculated and should be removed from the state
          const derivative = Bezier.derivative([target, targetOut, pointIn, point], 2 / 3);
          const normalizedD = Vector.normalize(derivative);
          const ghostVec = Vector.multiply(normalizedD, -Vector.dist(target, point) / 3);

          const ghostHandlePoint = Vector.add(this.props.source, ghostVec);

          this.props.actions.updateProp(this.props.point.id, '_ghost', {
            x: ghostHandlePoint.x,
            y: ghostHandlePoint.y,
          });
          this.props.actions.updateProp(this.props.point.id, '_isGhost', true);
        }
      }
      else if (this.props.type === 'out') {
        const [target, targetIn] = Path.getNextNode(this.props.parent, this.props.source.id, this.props.nodes);

        if (target) {
          const derivative = Bezier.derivative([point, pointOut, targetIn, target], 1 / 3);
          const normalizedD = Vector.normalize(derivative);
          const ghostVec = Vector.multiply(normalizedD, Vector.dist(target, point) / 3);
          const ghostHandlePoint = Vector.add(this.props.source, ghostVec);

          this.props.actions.updateProp(this.props.point.id, '_ghost', {
            x: ghostHandlePoint.x,
            y: ghostHandlePoint.y,
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
        </g>;
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
        </g>;
      }
    }

    const handlePoint = this.props.point._isGhost ? this.props.point._ghost : this.props.point;

    const path = this.props.source
      ? <path className="point-control" key={`${this.props.parent}-point-in-${this.props.source.id}`} d={`M${this.props.source.x} ${this.props.source.y} L${handlePoint.x} ${handlePoint.y}`}/>
      : false;


    const classes = classnames({
      [this.props.className]: true,
      'is-hovered': this.props.hovered === this.props.point.id,
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
  actions: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return { mode: state.ui.uiState, hovered: state.ui.hovered.point};
}

export default connect(mapStateToProps, mapDispatchToProps)(SvgSelector);
