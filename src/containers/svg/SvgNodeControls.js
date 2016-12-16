import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';

import * as Utils from '~/_utils/';

import { mapDispatchToProps } from './_utils';

class SvgNodeControls extends PureComponent {
  constructor(props) {
    super(props);
    this.renderChildren = this.renderChildren.bind(this);
  }

  renderChildren() {
    const { point, inControl, pathId, i} = this.props;
    let { expand, distribution, angle } = Utils.getNodeControls(point, inControl);
    let result = [];
    result.push(
      <circle
        key={`${pathId}inTangent${i}`}
        cx={expand.in.x}
        cy={expand.in.y}
        r='5'
        fill="orange"
        stroke="orange"/>
    );
    result.push(
      <circle
        key={`${pathId}outTangent${i}`}
        cx={expand.out.x}
        cy={expand.out.y}
        r='5'
        fill="orange"
        stroke="orange"/>
    );
    result.push(
      <path
        key={`${pathId}distributionControl${i}`}
        d={`
            M ${distribution.first.x},${distribution.first.y}
            L ${distribution.second.x},${distribution.second.y}
            L ${distribution.third.x},${distribution.third.y}
            L ${distribution.fourth.x},${distribution.fourth.y}
          `}
          fill="green"
      />
    );
    result.push(
      <path
        key={`${pathId}angleControl${i}`}
        d={`
          M ${angle.first.x},${angle.first.y}
          C ${angle.second.x},${angle.second.y}
            ${angle.third.x},${angle.third.y}
            ${angle.fourth.x},${angle.fourth.y}
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
};

function mapStateToProps(state) {
  return { mode: state.ui.uiState, hovered: state.ui.hovered.point};
}
export default connect(mapStateToProps, mapDispatchToProps)(SvgNodeControls);
