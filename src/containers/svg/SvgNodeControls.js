import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  getCalculatedParams,
  getCalculatedGlyph,
} from '~/_utils/parametric';

import {
  mapDispatchToProps,
} from './_utils';

import {
  getParentGlyphId,
} from '~/_utils/graph';

import {
  rotateVector,
  getAngleBetween2Lines,
} from '~/_utils/math';

class SvgNodeControls extends PureComponent {
  constructor(props) {
    super(props);
    this.renderChildren = this.renderChildren.bind(this);
  }

  renderChildren() {
    const { point, inControl, pathId, i} = this.props;
    let result = [];
    //Get normal vector
    let normal = {x: inControl.x - point.x, y: inControl.y - point.y};
    normal = rotateVector(normal.x, normal.y, point.angle);
    //http://math.stackexchange.com/a/1630886
    let normalDistance = Math.sqrt(
      Math.pow((point.x - normal.y) - point.x, 2) + Math.pow((point.y + normal.x) - point.y, 2)
    );
    let distanceRatioIn = (point.expand * (1 - point.distrib)) / normalDistance;
    let distanceRatioOut = (point.expand * point.distrib) / normalDistance;
    //Draw In tangent point
    let tanIn = {
      x: ((1 - distanceRatioIn) * point.x + distanceRatioIn * (point.x - normal.y)),
      y: ((1 - distanceRatioIn) * point.y + distanceRatioIn * (point.y + normal.x)),
    }
    result.push(
      <circle
        key={`${pathId}inTangent${i}`}
        cx={tanIn.x}
        cy={tanIn.y}
        r='5'
        fill="orange"
        stroke="orange"/>
    );
    //Draw Out tangent point
    let tanOut = {
      x: ((1 - distanceRatioOut) * point.x + distanceRatioOut * (point.x + normal.y)),
      y: ((1 - distanceRatioOut) * point.y + distanceRatioOut * (point.y - normal.x)),
    }
    result.push(
      <circle
        key={`${pathId}outTangent${i}`}
        cx={tanOut.x}
        cy={tanOut.y}
        r='5'
        fill="orange"
        stroke="orange"/>
    );
    //Draw offset control
    let offsetControl1 = {
      x: point.x - 30,
      y: point.y,
    }
    let offsetControl2 = {
      x: offsetControl1.x,
      y: offsetControl1.y + 10,
    }
    let offsetControl3 = {
      x: offsetControl1.x + 10,
      y: offsetControl1.y,
    }
    let offsetControl4 = {
      x: offsetControl1.x,
      y: offsetControl1.y - 10,
    }
    let angle = getAngleBetween2Lines(offsetControl1, point, point, inControl);
    offsetControl1.x = Math.cos(angle) * (offsetControl1.x - point.x) - Math.sin(angle) * (offsetControl1.y - point.y) + point.x;
    offsetControl1.y = Math.sin(angle) * (offsetControl1.x - point.x) - Math.cos(angle) * (offsetControl1.y - point.y) + point.y;
    offsetControl2.x = Math.cos(angle) * (offsetControl2.x - point.x) - Math.sin(angle) * (offsetControl2.y - point.y) + point.x;
    offsetControl2.y = Math.sin(angle) * (offsetControl2.x - point.x) - Math.cos(angle) * (offsetControl2.y - point.y) + point.y;
    offsetControl3.x = Math.cos(angle) * (offsetControl3.x - point.x) - Math.sin(angle) * (offsetControl3.y - point.y) + point.x;
    offsetControl3.y = Math.sin(angle) * (offsetControl3.x - point.x) - Math.cos(angle) * (offsetControl3.y - point.y) + point.y;
    offsetControl4.x = Math.cos(angle) * (offsetControl4.x - point.x) - Math.sin(angle) * (offsetControl4.y - point.y) + point.x;
    offsetControl4.y = Math.sin(angle) * (offsetControl4.x - point.x) - Math.cos(angle) * (offsetControl4.y - point.y) + point.y;
    result.push(
      <path
        key={`${pathId}offsetControl${i}`}
        d={`
            M ${offsetControl1.x},${offsetControl1.y}
            L ${offsetControl2.x},${offsetControl2.y}
            L ${offsetControl3.x},${offsetControl3.y}
            L ${offsetControl4.x},${offsetControl4.y}
          `}
          fill="green"
      />
    );
    //Draw angle control
    let angleControl1 = {
      x: point.x + 30,
      y: point.y + 15,
    }
    let angleControl2 = {
      x: angleControl1.x + 10,
      y: angleControl1.y - 10,
    }
    let angleControl3 = {
      x: angleControl1.x + 10,
      y: angleControl1.y - 20,
    }
    let angleControl4 = {
      x: angleControl1.x,
      y: angleControl1.y - 30,
    }
    angleControl1.x = Math.cos(angle) * (angleControl1.x - point.x) - Math.sin(angle) * (angleControl1.y - point.y) + point.x;
    angleControl1.y = Math.sin(angle) * (angleControl1.x - point.x) - Math.cos(angle) * (angleControl1.y - point.y) + point.y;
    angleControl2.x = Math.cos(angle) * (angleControl2.x - point.x) - Math.sin(angle) * (angleControl2.y - point.y) + point.x;
    angleControl2.y = Math.sin(angle) * (angleControl2.x - point.x) - Math.cos(angle) * (angleControl2.y - point.y) + point.y;
    angleControl3.x = Math.cos(angle) * (angleControl3.x - point.x) - Math.sin(angle) * (angleControl3.y - point.y) + point.x;
    angleControl3.y = Math.sin(angle) * (angleControl3.x - point.x) - Math.cos(angle) * (angleControl3.y - point.y) + point.y;
    angleControl4.x = Math.cos(angle) * (angleControl4.x - point.x) - Math.sin(angle) * (angleControl4.y - point.y) + point.x;
    angleControl4.y = Math.sin(angle) * (angleControl4.x - point.x) - Math.cos(angle) * (angleControl4.y - point.y) + point.y;
    result.push(
      <path
        key={`${pathId}angleControl${i}`}
        d={`
          M ${angleControl1.x},${angleControl1.y}
          C ${angleControl2.x},${angleControl2.y}
            ${angleControl3.x},${angleControl3.y}
            ${angleControl4.x},${angleControl4.y}
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
