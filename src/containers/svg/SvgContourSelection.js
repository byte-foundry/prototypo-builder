require('styles/svg/Selection.scss');

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { forEachNode } from '../../_utils/pathWalkers';
import SvgSelector from '../../components/svg/SvgSelector';

import {
  mapDispatchToProps
} from './_utils';

class SvgContourSelection extends Component {
  constructor(props) {
    super(props);
    this.renderChildren = this.renderChildren.bind(this);
  }

  renderChildren() {
    const { nodes, id } = this.props;
    const { childIds } = nodes[id];
    const result = [];

    childIds.forEach((pathId) => {
      const path = nodes[pathId];
      forEachNode(pathId, nodes, (point, inControl, outControl, i) => {
        result.push(
          <SvgSelector point={point} key={i} className="contour-point" updateProp={this.props.actions.updateProp}/>
        );
        if (inControl) {
          result.push(
            <path className="point-control" key={`point-in-${i}`} d={`M${point.x} ${point.y} L${inControl.x} ${inControl.y}`}/>
          );
          result.push(
            <SvgSelector point={inControl} key={`in${i}`} className="control-point"/>
          );
        }
        if (outControl) {
          result.push(
            <path className="point-control" key={`point-out-${i}`} d={`M${point.x} ${point.y} L${outControl.x} ${outControl.y}`}/>
          );
          result.push(
            <SvgSelector point={outControl} key={`out${i}`} className="control-point"/>
          );
        }
      });
    });
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

SvgContourSelection.propTypes = {
  actions: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return { nodes: state.nodes };
}

export default connect(mapStateToProps, mapDispatchToProps)(SvgContourSelection);
