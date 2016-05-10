import React from 'react';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import { mapCurve, forEachCurve } from './../../_utils/pathWalkers';

import SvgContour from './SvgContour';
import SvgFont from './SvgFont';
import SvgGlyph from './SvgGlyph';
import SvgContourSelection from './SvgContourSelection';

import {
  addOffcurve,
  addOncurve,
  addPath,
  createOffcurve,
  createOncurve,
  createPath,
  loadImageData,
  loadNodes,
  moveNode,
  setCoords,
  setMouseState,
  setNodeHovered,
  setNodeSelected,
  setNodeOptionsSelected,
  setPathHovered,
  setPathSelected,
  updateProp
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

  if (nodes[pathId].isSkeleton) {
    return '';
  }

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
    addOffcurve,
    addOncurve,
    addPath,
    createOffcurve,
    createOncurve,
    createPath,
    loadImageData,
    loadNodes,
    moveNode,
    setCoords,
    setMouseState,
    setNodeHovered,
    setNodeSelected,
    setNodeOptionsSelected,
    setPathHovered,
    setPathSelected,
    updateProp
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

export function getNearPath(coord, contour, nodes, error) {
  if ( !(contour in nodes) ) {
    return;
  }

  let result;
  nodes[contour].childIds.forEach((key) => {
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

export function isOnCurve(c0, c1, c2, c3, coord, error = 30) {
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

//This is for building skeletons
//TODO(franz): You should totally make a memoized cache for lut and length function
function reduce(c0, c1, c2, c3) {
  var i, t1=0, t2=0, step=0.01, segment, pass1=[], pass2=[];
  // first pass: split on extrema
  var extrema = getExtrema(c0, c1, c2, c3);
  if(extrema.indexOf(0)===-1) {
    extrema = [0].concat(extrema);
  }
  if(extrema.indexOf(1)===-1) {
    extrema.push(1);
  }
  for(t1=extrema[0], i=1; i<extrema.length; i++) {
    t2 = extrema[i];
    segment = split(c0, c1, c2, c3, 0, 1, t1, t2);
    segment._t1 = t1;
    segment._t2 = t2;
    pass1.push(segment);
    t1 = t2;
  }

  // second pass: further reduce these segments to simple segments
  pass1.forEach(function(p1) {
    t1=0;
    t2=0;
    while(t2 <= 1) {
      for(t2 = t1 + step; t2 <= 1 + step; t2 += step) {
        segment = split(p1.c0, p1.c1, p1.c2, p1.c3, p1._t1, p1._t2, t1, t2);
        if(!simple(segment.c0, segment.c1, segment.c2, segment.c3)) {
          t2 -= step;
          if(Math.abs(t1-t2) < step) {
            // we can never form a reduction
            return [];
          }
          segment = split(p1.c0, p1.c1, p1.c2, p1.c3, p1._t1, p1._t2, t1, t2);
          segment._t1 = map(t1,0,1,p1._t1,p1._t2);
          segment._t2 = map(t2,0,1,p1._t1,p1._t2);
          pass2.push(segment);
          t1 = t2;
          break;
        }
      }
    }
    if(t1 < 1) {
      segment = split(p1.c0, p1.c1, p1.c2, p1.c3, p1._t1, p1._t2, t1,1);
      segment._t1 = map(t1,0,1,p1._t1,p1._t2);
      segment._t2 = p1._t2;
      pass2.push(segment);
    }
  });
  return pass2;
}

function split(c0, c1, c2, c3, _t1, _t2, t1, t2) {
  // shortcuts
  if(t1===0 && !!t2) {
    return split(c0, c1, c2, c3, _t1, _t2, t2).left;
  }
  if(t2===1) {
    return split(c0, c1, c2, c3, _t1, _t2, t1).right;
  }

  // no shortcut: use "de Casteljau" iteration.
  var q = hull(c0, c1, c2, c3, t1);
  var result = {
    left: {
      c0: q[0],
      c1: q[4],
      c2: q[7],
      c3: q[9]
    },
    right: {
      c0: q[9],
      c1: q[8],
      c2: q[6],
      c3: q[3]
    },
    span: q
  };

  // make sure we bind _t1/_t2 information!
  result.left._t1  = map(0,  0, 1, _t1, _t2);
  result.left._t2  = map(t1, 0, 1, _t1, _t2);
  result.right._t1 = map(t1, 0, 1, _t1, _t2);
  result.right._t2 = map(1,  0, 1, _t1, _t2);

  // if we have no t2, we're done
  if(!t2) {
    return result;
  }

  // if we have a t2, split again:
  t2 = map(t2,t1,1,0,1);
  var subsplit = split(result.right.c0, result.right.c1, result.right.c2, result.right.c3, result.right._t1, result.right._t2, t2);
  return subsplit.left;
}

function hull(c0, c1, c2, c3, t) {
  var p = [c0, c1, c2, c3],
    _p = [],
    pt,
    q = [c0, c1, c2, c3],
    idx = 4,
    i=0,
    l=0;
  // we lerp between all points at each iteration, until we have 1 point left.
  while(p.length>1) {
    _p = [];
    for(i=0, l=p.length-1; i<l; i++) {
      pt = lerp(t,p[i],p[i+1]);
      q[idx++] = pt;
      _p.push(pt);
    }
    p = _p;
  }
  return q;
}

function map(v, ds,de, ts,te) {
  var d1 = de-ds, d2 = te-ts, v2 =  v-ds, r = v2/d1;
  return ts + d2*r;
}

function simple(c0, c1, c2, c3) {
  var a1 = angle(c0, c3, c1);
  var a2 = angle(c0, c3, c2);
  if(a1>0 && a2<0 || a1<0 && a2>0) {
    return false;
  }
  var n1 = bezierNormal(c0, c1, c2, c3, 0);
  var n2 = bezierNormal(c0, c1, c2, c3, 1);
  var s = n1.x*n2.x + n1.y*n2.y;

  let result = Math.abs(Math.acos(s));
  return result < Math.PI/12;
}


function angle(o,v1,v2) {
  var dx1 = v1.x - o.x,
    dy1 = v1.y - o.y,
    dx2 = v2.x - o.x,
    dy2 = v2.y - o.y,
    cross = dx1*dy2 - dy1*dx2,
    m1 = Math.sqrt(dx1*dx1+dy1*dy1),
    m2 = Math.sqrt(dx2*dx2+dy2*dy2),
    dot;

  dx1/=m1; dy1/=m1; dx2/=m2; dy2/=m2;
  dot = dx1*dx2 + dy1*dy2;
  return Math.atan2(cross, dot);
}

function bezierLength(c0, c1, c2, c3) {
  const lut = getLut(c0, c1, c2, c3);
  let sum = 0;

  for(let i = 0; i < lut.length - 1; i++) {
    sum += dist(lut[i], lut[i+1]);
  }

  return sum;
}

function scale(c0, c1, c2, c3, d) {
  var order = 3;
  var distanceFn = false;
  if(typeof d === 'function') { distanceFn = d; }

  // TODO: add special handling for degenerate (=linear) curves.
  var clockwise = bezierClockwise(c0, c1, c2, c3);
  var r1 = distanceFn ? distanceFn(0) : d;
  var r2 = distanceFn ? distanceFn(1) : d;
  var v = [ bezierOffset(c0, c1, c2, c3, 0,10), bezierOffset(c0, c1, c2, c3, 1,10) ];
  var o = lli4(v[0], v[0].c, v[1], v[1].c);
  if(!o) { throw new Error('cannot scale this curve. Try reducing it first.'); }
  // move all points by distance 'd' wrt the origin 'o'
  var points=[ c0, c1, c2, c3], np=[];

  // move end points by fixed distance along normal.
  [0,1].forEach(function(t) {
    var p = np[t*order] = _.cloneDeep(points[t*order]);
    p.x += (t?r2:r1) * v[t].n.x;
    p.y += (t?r2:r1) * v[t].n.y;
  });

  if (!distanceFn) {
    // move control points to lie on the intersection of the offset
    // derivative vector, and the origin-through-control vector
    [0,1].forEach(function(t) {
      var p = np[t*order];
      var d = getDerivative(c0, c1, c2, c3, t);
      var p2 = { x: p.x + d.x, y: p.y + d.y };
      np[t+1] = lli4(p, p2, o, points[t+1]);
    });
    return {
      c0: np[0],
      c1: np[1],
      c2: np[2],
      c3: np[3]
    };
  }

  // move control points by "however much necessary to
  // ensure the correct tangent to endpoint".
  [0,1].forEach(function(t) {
    var p = points[t+1];
    var ov = {
      x: p.x - o.x,
      y: p.y - o.y
    };
    var rc = distanceFn ? distanceFn((t+1)/order) : d;
    if(distanceFn && !clockwise) rc = -rc;
    var m = Math.sqrt(ov.x*ov.x + ov.y*ov.y);
    ov.x /= m;
    ov.y /= m;
    np[t+1] = {
      x: p.x + rc*ov.x,
      y: p.y + rc*ov.y
    }
  });
  return {
    c0: np[0],
    c1: np[1],
    c2: np[2],
    c3: np[3]
  };
}

function bezierClockwise(c0, c1, c2, c3) {
  return angle(c0, c3, c1) > 0;
}

function bezierOffset(c0, c1, c2, c3, t, d) {
  const c = computePoint(c0, c1, c2, c3, t);
  const n = bezierNormal(c0, c1, c2, c3, t);
  return {
    c,
    n,
    x: c.x + n.x * d,
    y: c.y + n.y * d
  }
}

function bezierNormal(c0, c1, c2, c3, t) {
  const d = getDerivative(c0, c1, c2, c3, t);
  return normalizeVec({ x: -d.y, y: d.x });
}

function lli8(x1,y1,x2,y2,x3,y3,x4,y4) {
  const nx = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4);
  const ny = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4);
  const d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

  if(d==0) {
    return false;
  }
  return { x: nx / d, y: ny / d };
}

function lli4(p1, p2, p3, p4) {
  const x1 = p1.x, y1 = p1.y;
  const x2 = p2.x, y2 = p2.y;
  const x3 = p3.x, y3 = p3.y;
  const x4 = p4.x, y4 = p4.y;
  return lli8(x1, y1, x2, y2, x3, y3, x4, y4);
}

function lerp(r, v1, v2) {
  const ret = {
    x: v1.x + r * (v2.x - v1.x),
    y: v1.y + r * (v2.y - v1.y)
  };
  if(!!v1.z && !!v2.z) {
    ret.z =  v1.z + r*(v2.z-v1.z);
  }
  return ret;
}

export function outline(c0, c1, c2, c3, d1, d2, d3, d4) {
  d2 = (typeof d2 === 'undefined') ? d1 : d2;
  const reduced = reduce(c0, c1, c2, c3);
  const len = reduced.length;
  const fcurves = [];
  let bcurves = [];
  let alen = 0;
  const tlen = bezierLength(c0, c1, c2, c3);

  var graduated = (typeof d3 !== 'undefined' && typeof d4 !== 'undefined');

  function linearDistanceFunction(s,e, tlen,alen,slen) {
    return function (v) {
      var f1 = alen/tlen, f2 = (alen+slen)/tlen, d = e-s;
      return map(v, 0,1, s+f1*d, s+f2*d);
    };
  }

  // form curve oulines
  reduced.forEach(function(segment) {
    let slen = bezierLength(segment.c0, segment.c1, segment.c2, segment.c3);
    if (graduated) {
      fcurves.push(scale(segment.c0, segment.c1, segment.c2, segment.c3, linearDistanceFunction( d1, d3, tlen, alen, slen)));
      bcurves.push(scale(segment.c0, segment.c1, segment.c2, segment.c3, linearDistanceFunction(-d2,-d4, tlen, alen, slen)));
    } else {
      fcurves.push(scale(segment.c0, segment.c1, segment.c2, segment.c3, d1));
      bcurves.push(scale(segment.c0, segment.c1, segment.c2, segment.c3, -d2));
    }
    alen += slen;
  });

  // reverse the "return" outline
  bcurves = bcurves.map(function({c0, c1, c2, c3}) {
    return {
      c0: c3,
      c1: c2,
      c2: c1,
      c3: c0
    };
  }).reverse();

  // form the endcaps as lines
  const fs = fcurves[0].c0;
  const fe = fcurves[len-1].c3;
  const bs = bcurves[len-1].c3;
  const be = bcurves[0].c0;
  const ls = {c0: bs, c1: bs, c2: fs, c3: fs};
  const le = {c0: fe, c1: fe, c2: be, c3: be};
  const segments = [ls].concat(fcurves).concat([le]).concat(bcurves);

  return segments;
}

//Vector operation
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

export function dotProduct(a, b) {
  return a.x * b.x + a.y * b.y;
}
