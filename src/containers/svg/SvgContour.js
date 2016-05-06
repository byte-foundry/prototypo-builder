import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import {
  forEachCurve
} from '../../_utils/path';

import SvgExpandedSkeleton from './SvgExpandedSkeleton';

import {
  getCalculatedParams,
  getCalculatedNodes
} from './../_utils';

import {
  renderPathData,
  mapDispatchToProps,
  equalVec,
  addVec,
  subtractVec,
  multiplyVecByN,
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
          forEachCurve(pathId, nodes, (c0, c1, c2, c3, i, length) => {
            let pathString = '';
            if (c2 && c3) {
              if (equalVec(c0, c1)) {
                const relC1 = subtractVec(c1._ghost, c0);
                relC1.x += 0.1;
                relC1.y += 0.1;
                c1 = addVec(c0, multiplyVecByN(relC1, 0.1));
              }
              if (equalVec(c2, c3)) {
                const relC2 = subtractVec(c2._ghost, c3);
                relC2.x += 0.1;
                relC2.y += 0.1;
                c2 = addVec(c3, multiplyVecByN(relC2, 0.1));
              }
              const curves = outline(c0, c1, c2, c3,
                                     (c0.expand || 20) * (c0.distrib || 0.5),
                                     (c0.expand || 20) * (1 - (c0.distrib || 0.5)),
                                     (c3.expand || 20) * (c3.distrib || 0.5),
                                     (c3.expand || 20) * (1 - (c3.distrib || 0.5))
                                    );
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
    const { nodes, id } = this.props;
    const classes = classnames({
      contour: true,
      'is-closed': nodes[this.props.id].isClosed,
    });
    return (
      <g>
        <path className={classes} d={this.renderChildren()} />
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
    ),
    ui: state.ui
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SvgContour);
