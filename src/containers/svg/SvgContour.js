import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  forEachCurve
} from '../../_utils/pathWalkers';

import SvgExpandedSkeleton from './SvgExpandedSkeleton';

import {
  getCalculatedParams,
  getCalculatedNodes
} from './../_utils';

import {
  renderPathData,
  mapDispatchToProps,
  outline
} from './_utils';

class SvgContour extends Component {
  constructor(props) {
    super(props);
    this.renderPathData = renderPathData.bind(this);
    this.renderChildren = this.renderChildren.bind(this);
  }

  renderChildren() {
    const { nodes, id } = this.props;
    const { childIds } = nodes[id];

    const result = childIds.map((pathId) => {
      return this.renderPathData(pathId);
    }).join(' ');
    return result;
  }

  renderExpandedSkeletons() {
    const { nodes, id } = this.props;
    const { childIds } = nodes[id];

    return (
      childIds
        .filter((pathId) => {
          return nodes[pathId].isSkeleton;
        })
        .map((pathId) => {

          const paths = [];
          forEachCurve(pathId, nodes, (c0, c1, c2, c3, i) => {
            let pathString = '';
            if (c2 && c3) {
              const curves = outline(c0, c1, c2, c3, 30);
              curves.forEach((curve) => {
                if (pathString.length === 0) {
                  pathString += `M${curve.c0.x} ${curve.c0.y}`;
                }

                pathString += ` C${curve.c1.x},${curve.c1.y} ${curve.c2.x},${curve.c2.y} ${curve.c3.x},${curve.c3.y}`;
              });
            }
            paths.push(<path d={pathString} key={`curve-${i}`}/>);
          });

          return paths;
        })
    );
  }

  render() {
    return (
      <g>
        <path className="contour" d={this.renderChildren()} />
        {this.renderExpandedSkeletons()}
      </g>
    );
  }
}

SvgContour.propTypes = {
  actions: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    nodes: getCalculatedNodes(
      state.nodes,
      getCalculatedParams(state.nodes['font-initial'])
    )
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SvgContour);
