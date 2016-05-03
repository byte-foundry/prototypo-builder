import React from 'react';
import { bindActionCreators } from 'redux';

import { mapCurve, forEachCurve } from './../../_utils/pathWalkers';

import SvgContour from './SvgContour';
import SvgFont from './SvgFont';
import SvgGlyph from './SvgGlyph';
import SvgContourSelection from './SvgContourSelection';

import {
  updateProp,
  setCoords,
  setMouseState,
  createOffcurve,
  createOncurve,
  addOffcurve,
  addOncurve,
  moveNode,
  setNodeSelected,
  setNodeHovered,
  setPathSelected,
  setPathHovered,
  createPath,
  addPath
} from './../../actions/all';

const componentMap = {
  contour: SvgContour,
  font: SvgFont,
  glyph: SvgGlyph
};

const selectionComponentMap = {
  contour: SvgContourSelection
}

export function renderSvgChild(childId) {
  const { id } = this.props;
  const childType = childId.split('-')[0];
  const SvgNode = componentMap[childType];

  return [
    <SvgNode key={childId} id={childId} parentId={id} />
  ];
}

export function renderSelectionAreas(childId) {
  const { id } = this.props;
  const childType = childId.split('-')[0];
  const SvgNode = selectionComponentMap[childType];

  return [
    <SvgNode key={childId} id={childId} parentId={id} />
  ];
}

export function renderPathData(pathId) {
  const { nodes } = this.props;

  return mapCurve(pathId, nodes, (start, c1, c2, end, i, length) => {
    let sPoint = '';

    if ( i === 0 ) {
      sPoint += `M ${start.x || 0},${start.y || 0}`;
    }

    if ( end ) {
      sPoint +=
        `C ${c1.x || 0},${c1.y || 0} ${c2.x || 0},${c2.y || 0} ${end.x || 0} ${end.y || 0}`;
    }

    if ( i === length-1 && nodes[pathId].isClosed ) {
      sPoint += 'Z';
    }

    return sPoint;
  }).join(' ');
}

export function mapStateToProps(state, ownProps) {
  return state.nodes[ownProps.id];
}

export function mapDispatchToProps(dispatch) {
  const actions = {
    updateProp,
    setCoords,
    setMouseState,
    createOncurve,
    createOffcurve,
    addOffcurve,
    addOncurve,
    moveNode,
    setNodeSelected,
    setNodeHovered,
    setPathSelected,
    setPathHovered,
    createPath,
    addPath
  };
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}

export function getSvgCoordsFromClientCoords( clientCoord, elem ) {
  const svg = document.querySelector('svg');
  const target = elem || svg;

  const svgPoint = svg.createSVGPoint();
  svgPoint.x = clientCoord.x;
  svgPoint.y = clientCoord.y;
  //create global space coords
  const globalPoint = svgPoint.matrixTransform(svg.getScreenCTM().inverse());

  //create local space coords for the element being manipulated, returns identity if elem = svg
  const local = globalPoint.matrixTransform(svg.getScreenCTM().inverse().multiply(target.getScreenCTM()));
  return local;
}


//A lot of the from here is from pomax bezier.js library except it is not using
//retention. And so doesn't need the creation of bezier object.
//The license of bezier.js is MIT and so is this

export const NULL_VEC = {x: 0, y: 0};

export function getNearPath(coord, nodes, error) {
  let result;
  Object.keys(nodes).forEach((key) => {
    const node = nodes[key];
    if (node.type === 'path') {
      forEachCurve(node.id, nodes, (c0, c1, c2, c3) => {
        if (!result && c2 && c3) {
          const on = isOnCurve(c0, c1, c2, c3, coord, error);
          if (on) {
            result = node.id;
          }
        }
      });
    }
  });
  return result;
}

export function getNearNode(coord, pathId, nodes, error = 30) {
  const path = nodes[pathId];
  const length = path.isClosed ? path.childIds.length - 1 : path.childIds.length;
  for (let i = 0; i < length; i++) {
    let point = nodes[path.childIds[i]];

    if (point._isGhost) {
      point = {
        ...point,
        ...point._ghost
      }
    }

    const distance = dist(point,coord);
    if ( distance < error) {
      return point.id;
    }
  }
}

export function isOnCurve(c0, c1, c2, c3, coord, error = 10) {
  const lut = getLut(c0, c1, c2, c3);
  const hits = [];
  let t = 0;

  for (let i = 0; i < lut.length; i++) {
    const currentLine = lut[i];

    if (dist(currentLine, coord) < error) {
      hits.push(currentLine);
      t += i / lut.length;
    }
  }

  if (!hits.length) {
    return false;
  }

  t = t / hits.length;
  return t;
}

export function getLut(c0, c1, c2, c3, steps = 100) {
  const lut = [];

  for (let i = 0; i <= steps; i++) {
    lut.push(computePoint(c0, c1, c2, c3, i/steps));
  }
  return lut;
}

export function computePoint(c0, c1, c2, c3, t) {
  const minusT = 1 - t;
  const tSquared = t * t;
  const minusTSquared = minusT * minusT;

  const a = minusT * minusTSquared;
  const b = minusTSquared * t * 3;
  const c = minusT * tSquared * 3;
  const d = t * tSquared;

  const result = {
    x: a * c0.x + b * c1.x + c * c2.x + d * c3.x,
    y: a * c0.y + b * c1.y + c * c2.y + d * c3.y
  }

  return result;
}

export function getPathBbox(pathId, nodes) {
  const node = nodes[pathId];
  const result = {
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity
  };

  forEachCurve(node.id, nodes, (c0, c1, c2, c3) => {
    if (c2 && c3) {
      const bbox = getBbox(c0, c1, c2, c3);

      result.minX = Math.min(result.minX, bbox.minX);
      result.minY = Math.min(result.minY, bbox.minY);
      result.maxX = Math.max(result.maxX, bbox.maxX);
      result.maxY = Math.max(result.maxY, bbox.maxY);
    }
  });

  return result;
}

export function getBbox(c0, c1, c2, c3) {
  const extrema = getExtrema(c0, c1, c2, c3);
  const xMinMax = getMinMax(c0, c1, c2, c3, 'x', extrema);
  const yMinMax = getMinMax(c0, c1, c2, c3, 'y', extrema);

  return {
    minX: xMinMax.min,
    maxX: xMinMax.max,
    minY: yMinMax.min,
    maxY: yMinMax.max
  }
}

export function getExtrema(c0, c1, c2, c3) {
  const dControlPoint = getDerivativeControlPoints(c0, c1, c2, c3);
  let result = [];

  ['x', 'y'].forEach((dim) => {
    let p = dControlPoint[0].map( d => d[dim] );
    result = result.concat(getRoots(p));

    p = dControlPoint[1].map( d => d[dim] );
    result = result.concat( getRoots(p) );

    result = result.filter( t => t >= 0 && t<= 1 );
  });

  result.sort();
  return result;
}

export function getDerivativeControlPoints(c0, c1, c2, c3) {
  const points = [];
  for(let p=[c0, c1, c2, c3], d=p.length, c=d-1; d>1; d--, c--) {
    var list = [];
    for(let j=0, dpt; j<c; j++) {
      dpt = {
        x: c * (p[j+1].x - p[j].x),
        y: c * (p[j+1].y - p[j].y)
      };
      list.push(dpt);
    }
    points.push(list);
    p = list;
  }
  return points;
}

function getRoots(p) {
  if(p.length === 3) {
    var a = p[0],
    b = p[1],
    c = p[2],
    d = a - 2*b + c;
    if(d!==0) {
      const m1 = -Math.sqrt(b*b-a*c),
      m2 = -a+b,
      v1 = -( m1+m2)/d,
      v2 = -(-m1+m2)/d;
      return [v1, v2];
    }
    else if(b!==c && d===0) {
      return [ (2*b-c)/(2*(b-c)) ];
    }
      return [];
  }

  // linear roots are even easier
  if(p.length === 2) {
    var a = p[0], b = p[1];
    if(a!==b) { return [a/(a-b)]; }
    return [];
  }
}

function getMinMax(c0, c1, c2, c3, dim, list) {
  if(!list) {
    return { min:0, max:0 };
  }

  let min=Infinity;
  let max=-min;
  let t;
  let c;

  if(list.indexOf(0)===-1) {
    list = [0].concat(list);
  }
  if(list.indexOf(1)===-1) {
    list.push(1);
  }

  for(var i=0,len=list.length; i<len; i++) {
    t = list[i];
    c = computePoint(c0, c1, c2, c3, t);
    if(c[dim] < min) { min = c[dim]; }
    if(c[dim] > max) { max = c[dim]; }
  }
  return { min, max };
}

export function dist(a, b) {
  const abVec = subtractVec(b, a);
  return Math.sqrt(Math.pow(abVec.x, 2) + Math.pow(abVec.y, 2));
}

export function addVec(a, b) {
  return {
    x: a.x + b.x,
    y: a.y + b.y
  };
}

export function subtractVec(a, b) {
  return {
    x: a.x - b.x,
    y: a.y - b.y
  };
}

export function multiplyVecByN(a, n) {
  return {
    x: a.x * n,
    y: a.y * n
  }
}

export function equalVec(a, b) {
  return a.x === b.x && a.y === b.y;
}

export function normalizeVec(a) {
  const norm = dist(a, NULL_VEC);

  return multiplyVecByN(a, 1 / norm);
}

export function getDerivative(c0, c1, c2, c3, t) {
  const mt = 1 - t;
  const p = getDerivativeControlPoints(c0, c1, c2, c3)[0];

  const a = mt * mt;
  const b = mt * t * 2;
  const c = t * t;

  const ret = {
    x: a * p[0].x + b * p[1].x + c * p[2].x,
    y: a * p[0].y + b * p[1].y + c * p[2].y
  };

  return ret;
}

