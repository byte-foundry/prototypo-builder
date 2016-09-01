import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import {
  forEachCurve,
} from '~/_utils/path';

import {
  getParentGlyphId,
} from '~/_utils/graph';

// import SvgExpandedSkeleton from './SvgExpandedSkeleton';

import {
  getCalculatedParams,
  getCalculatedGlyph,
} from './../_utils';

import {
  renderPathData,
  mapDispatchToProps,
  equalVec,
  addVec,
  subtractVec,
  multiplyVecByN,
  normalizeVec,
  dotProduct,
  outline,
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
              curves.forEach((curve, i) => {
                if (pathString.length === 0) {
                  pathString += `M${curve.c0.x} ${curve.c0.y}`;
                }

                if (c0.isSmoothSkeleton && i === 1) {
                  const unitC1Vec = normalizeVec(subtractVec(c1, c0));
                  const newCurveC1 = multiplyVecByN(unitC1Vec, dotProduct(subtractVec(curve.c1, curve.c0), unitC1Vec));

                  curve.c1 = addVec(curve.c0, newCurveC1);
                }

                if (c0.isSmoothSkeleton && i === curves.length - 1) {
                  const unitC1Vec = normalizeVec(subtractVec(c1, c0));
                  const newCurveC2 = multiplyVecByN(unitC1Vec, dotProduct(subtractVec(curve.c2, curve.c3), unitC1Vec));

                  curve.c2 = addVec(curve.c3, newCurveC2);
                }

                if (c3.isSmoothSkeleton && i === curves.length / 2 + 1) {
                  const unitC1Vec = normalizeVec(subtractVec(c2, c3));
                  const newCurveC1 = multiplyVecByN(unitC1Vec, dotProduct(subtractVec(curve.c1, curve.c0), unitC1Vec));

                  curve.c1 = addVec(curve.c0, newCurveC1);
                }

                if (c3.isSmoothSkeleton && i === curves.length / 2 - 1) {
                  const unitC1Vec = normalizeVec(subtractVec(c2, c3));
                  const newCurveC2 = multiplyVecByN(unitC1Vec, dotProduct(subtractVec(curve.c2, curve.c3), unitC1Vec));

                  curve.c2 = addVec(curve.c3, newCurveC2);
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
      'is-closed': nodes[id].isClosed,
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
  actions: PropTypes.object.isRequired,
}

function mapStateToProps(state, props) {
  return {
    nodes: getCalculatedGlyph(
      state,
      getCalculatedParams(state.nodes['font_initial'].params),
      getParentGlyphId(state.nodes, props.id)
    ),
    ui: state.ui,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SvgContour);
