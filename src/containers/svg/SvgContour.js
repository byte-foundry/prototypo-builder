import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import Bezier from 'bezier-js/fp';

import * as Utils from '~/_utils/';
import * as Path from '~/_utils/Path';
import * as Graph from '~/_utils/Graph';
import * as Parametric from '~/_utils/Parametric';
import * as TwoD from '~/_utils/2D';
import * as Vector from '~/_utils/Vector';

import {
  renderPathData,
  mapDispatchToProps,
} from './_utils';

class SvgContour extends React.PureComponent {
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

          Path.forEachCurve(pathId, nodes, (c0, _c1, _c2, c3, i) => {
            let pathString = '';
            let c1 = _c1;
            let c2 = _c2;

            if (c2 && c3) {
              if (Vector.isEqual(c0, c1)) {
                const relC1 = Vector.subtract(c1._ghost, c0);

                relC1.x += 0.1;
                relC1.y += 0.1;
                c1 = Vector.add(c0, Vector.multiply(relC1, 0.1));
              }
              if (Vector.isEqual(c2, c3)) {
                const relC2 = Vector.subtract(c2._ghost, c3);

                relC2.x += 0.1;
                relC2.y += 0.1;
                c2 = Vector.add(c3, Vector.multiply(relC2, 0.1));
              }
              const curves = Bezier.outline(
                [c0, c1, c2, c3],
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
                  const unitC1Vec = Vector.normalize(Vector.subtract(c1, c0));
                  const newCurveC1 = Vector.multiply(unitC1Vec, Vector.dot(Vector.subtract(curve.c1, curve.c0), unitC1Vec));

                  curve.c1 = Vector.add(curve.c0, newCurveC1);
                }

                if (c0.isSmoothSkeleton && i === curves.length - 1) {
                  const unitC1Vec = Vector.normalize(Vector.subtract(c1, c0));
                  const newCurveC2 = Vector.multiply(unitC1Vec, Vector.dot(Vector.subtract(curve.c2, curve.c3), unitC1Vec));

                  curve.c2 = Vector.add(curve.c3, newCurveC2);
                }

                if (c3.isSmoothSkeleton && i === curves.length / 2 + 1) {
                  const unitC1Vec = Vector.normalize(Vector.subtract(c2, c3));
                  const newCurveC1 = Vector.multiply(unitC1Vec, Vector.dot(Vector.subtract(curve.c1, curve.c0), unitC1Vec));

                  curve.c1 = Vector.add(curve.c0, newCurveC1);
                }

                if (c3.isSmoothSkeleton && i === curves.length / 2 - 1) {
                  const unitC1Vec = Vector.normalize(Vector.subtract(c2, c3));
                  const newCurveC2 = Vector.multiply(unitC1Vec, Vector.dot(Vector.subtract(curve.c2, curve.c3), unitC1Vec));

                  curve.c2 = Vector.add(curve.c3, newCurveC2);
                }

                pathString += ` C${curve.c1.x},${curve.c1.y} ${curve.c2.x},${curve.c2.y} ${curve.c3.x},${curve.c3.y}`;
              });
            }
            paths.push( <path d={pathString} key={`curve-${i}`}/>);
          });

          return paths;
        })
    );
  }
  drawInterpolatedTangents(c0, c1, c2, c3, steps, pathId, j) {
    let n;
    let c;
    let result = [];

    for (let i = 1; i < steps; i++) {
      ({ n, c } = Bezier.offset(
        [c0, c1, c2, c3],
        i/steps,
        Utils.lerpValues(c0.expand, c3.expand, i/steps))
      );
      if (!Number.isNaN(n.x) && !Number.isNaN(c.x)) {
        let t = i/steps;
        let angleLerp = Utils.lerpValues(c0.angle % 360, c3.angle % 360, t);
        let distribLerp = Utils.lerpValues(c0.distrib, c3.distrib, t);
        let expandLerp = Utils.lerpValues(c0.expand, c3.expand, t);

        n = TwoD.rotate(n, angleLerp);
        result.push (
          <path key={`tan-${pathId}${j}${i}`}
            id={`tan-${pathId}${j}${i}`}
            d={`M${c.x + n.x * (distribLerp * expandLerp)}
                 ${c.y + n.y * (distribLerp * expandLerp)}
            L${c.x - n.x * ((1 - distribLerp) * expandLerp)}
             ${c.y - n.y * ((1 - distribLerp) * expandLerp)}`}
            stroke="#ff00ff"
            />
        );
      }
    }
    return result;
  }
  drawCatmullOutline(c0, c1, c2, c3, steps) {
    return Utils.getCurveOutline(c0,c1,c2,c3,steps);
  }
  drawSimpleOutline(c0,c1,c2,c3, c0tanIn, c3tanIn, c0tanOut, c3tanOut, beta1, beta2) {
    let inContour = '';
    let outContour = '';
    const c0c1Inray = {point: c0tanIn, angle: (Math.atan2(c1.y - c0.y, c1.x - c0.x))};
    const c2c3Inray = {point: c3tanIn, angle: (Math.atan2(c2.y - c3.y, c2.x - c3.x))};
    const intersectIn = TwoD.rayRayIntersection(
      c0c1Inray.point, c0c1Inray.angle, c2c3Inray.point, c2c3Inray.angle
    );
    const c0tanInCurve = {};
    const c3tanInCurve = {};

    c0tanInCurve.x = c0tanIn.x + (intersectIn.x - c0tanIn.x) * beta1;
    c0tanInCurve.y = c0tanIn.y + (intersectIn.y - c0tanIn.y) * beta1;
    c3tanInCurve.x = c3tanIn.x + (intersectIn.x - c3tanIn.x) * beta1;
    c3tanInCurve.y = c3tanIn.y + (intersectIn.y - c3tanIn.y) * beta1;
    inContour+= `
            C ${c0tanInCurve.x},${c0tanInCurve.y}
              ${c3tanInCurve.x},${c3tanInCurve.y}
              ${c3tanIn.x},${c3tanIn.y}
          `;
    const c0c1Outray = {point: c0tanOut, angle: (Math.atan2(c1.y - c0.y, c1.x - c0.x))};
    const c2c3Outray = {point: c3tanOut, angle: (Math.atan2(c2.y - c3.y, c2.x - c3.x))};
    const intersectOut = TwoD.rayRayIntersection(
      c0c1Outray.point,
      c0c1Outray.angle,
      c2c3Outray.point,
      c2c3Outray.angle
    );
    const c0tanOutCurve = {};
    const c3tanOutCurve = {};

    c0tanOutCurve.x = c0tanOut.x + (intersectOut.x - c0tanOut.x) * beta2;
    c0tanOutCurve.y = c0tanOut.y + (intersectOut.y - c0tanOut.y) * beta2;
    c3tanOutCurve.x = c3tanOut.x + (intersectOut.x - c3tanOut.x) * beta2;
    c3tanOutCurve.y = c3tanOut.y + (intersectOut.y - c3tanOut.y) * beta2;
    outContour +=`
            C ${c0tanOutCurve.x},${c0tanOutCurve.y}
              ${c3tanOutCurve.x},${c3tanOutCurve.y}
              ${c3tanOut.x},${c3tanOut.y}
          `;
    return {
      inContour: inContour,
      outContour: outContour,
    };
  }
  renderOutline() {
    const { nodes, id, ui } = this.props;
    const { childIds } = nodes[id];
    const contourMode = ui.contourMode || 'catmull';
    const drawInterpolatedTangents = ui.showInterpolatedTangents || false;

    return (
      childIds
        .filter((pathId) => {
          return nodes[pathId];
        })
        .map((pathId) => {
          let result = [];
          let inContour = '';
          let outContour = '';
          // draw tangents
          let j = 0;
          let steps = 10;
          let beta1 = 0.55;
          let beta2 = 0.65;

          Path.forEachCurve(pathId, nodes, (c0, c1, c2, c3) => {
            if (c2 && c3) {
              if (drawInterpolatedTangents) {
                result.push(this.drawInterpolatedTangents(c0, c1, c2, c3, steps, pathId, j));
              }
              j++;
              if (contourMode === 'catmull') {
                let catmullContour = this.drawCatmullOutline(c0, c1, c2, c3, steps, pathId, j);

                inContour += catmullContour.inContour;
                outContour = catmullContour.outContour + outContour;
              }
              if (c1._isGhost) {
                c1.x = c1._ghost.x;
                c1.y = c1._ghost.y;
              }
              if (c2._isGhost) {
                c2.x = c2._ghost.x;
                c2.y = c2._ghost.y;
              }
              const c0tangents = Utils.getTangentPoints(c0, c1);
              const c3tangents = Utils.getTangentPoints(c3, c2);

              if (contourMode === 'simple' && c3tangents.in && c0tangents.in) {
                if (j === 1) {
                  inContour += `M ${c0tangents.in.x},${c0tangents.in.y}`;
                  outContour += `M ${c0tangents.out.x},${c0tangents.out.y}`;
                }
                let simpleContour = this.drawSimpleOutline(c0,c1,c2,c3, c0tangents.out, c3tangents.in, c0tangents.in, c3tangents.out, beta1, beta2, pathId, j);

                inContour += simpleContour.inContour;
                outContour += simpleContour.outContour;
              }
            }
          });
        if (contourMode === 'catmull') {
          result.push(
            <polyline key={`contour-${pathId}`}
            id={`contour-${pathId}`}
            points={inContour + ' ' + outContour}
            stroke={nodes[id].isClosed ? 'transparent' : 'rgb(255,20,90)'}
            fill={nodes[id].isClosed ? 'black' : 'transparent'}
            strokeWidth="2"
            fillRule="nonzero"
            />
          );
        }
        else if (contourMode === 'simple') {
          result.push(
            <path key={`contour-${pathId}`}
              id={`contour-${pathId}`}
              d={inContour + ' ' + outContour}
              stroke={nodes[id].isClosed ? 'transparent' : '#00ff00'}
              strokeWidth="2"
              fill={nodes[id].isClosed ? 'black' : 'transparent'}
              fillRule="evenodd"
              />
          );
        }
        return result;
        })
      );
  }

  render() {
    const classes = classnames({
      contour: true,
    });

    return (
      <g>
        <path className={classes} d={this.renderChildren()} />
        {this.renderExpandedSkeletons()}
        {this.renderOutline()}
      </g>
    );
  }
}

SvgContour.propTypes = {
  actions: React.PropTypes.object.isRequired,
};

function mapStateToProps(state, props) {
  return {
    nodes: Parametric.getCalculatedGlyph(
      state,
      Parametric.getCalculatedParams(state.nodes.font_initial.params),
      Graph.getParentGlyphId(state.nodes, props.id)
    ),
    ui: state.ui,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SvgContour);
