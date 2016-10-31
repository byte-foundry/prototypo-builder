import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  mapDispatchToProps,
  getNodeControls,
} from './_utils';

class SvgNodeControls extends PureComponent {
  constructor(props) {
    super(props);
    this.renderChildren = this.renderChildren.bind(this);
  }

  renderChildren() {
    const { point, inControl, pathId, i} = this.props;
    let controls = getNodeControls(point, inControl);
    let result = [];
    result.push(
      <circle
        key={`${pathId}inTangent${i}`}
        cx={controls.expand.in.x}
        cy={controls.expand.in.y}
        r='5'
        fill="orange"
        stroke="orange"/>
    );
    result.push(
      <circle
        key={`${pathId}outTangent${i}`}
        cx={controls.expand.out.x}
        cy={controls.expand.out.y}
        r='5'
        fill="orange"
        stroke="orange"/>
    );
    result.push(
      <path
        key={`${pathId}distributionControl${i}`}
        d={`
            M ${controls.distribution.first.x},${controls.distribution.first.y}
            L ${controls.distribution.second.x},${controls.distribution.second.y}
            L ${controls.distribution.third.x},${controls.distribution.third.y}
            L ${controls.distribution.fourth.x},${controls.distribution.fourth.y}
          `}
          fill="green"
      />
    );
    result.push(
      <path
        key={`${pathId}angleControl${i}`}
        d={`
          M ${controls.angle.first.x},${controls.angle.first.y}
          C ${controls.angle.second.x},${controls.angle.second.y}
            ${controls.angle.third.x},${controls.angle.third.y}
            ${controls.angle.fourth.x},${controls.angle.fourth.y}
          `}
          stroke="green"
          fill="transparent"
          strokeWidth="6"
      />
    );
    return result;
  }
  render() {
    return (
      <g>
        {this.renderChildren()}
      </g>
    );
  }
}

SvgNodeControls.propTypes = {
  actions: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  return { mode: state.ui.uiState, hovered: state.ui.hovered.point};
}
export default connect(mapStateToProps, mapDispatchToProps)(SvgNodeControls);
