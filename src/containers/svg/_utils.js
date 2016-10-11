import React from 'react';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import { mapCurve, forEachCurve } from '~/_utils/path';
import { getNodeType } from '~/_utils/graph';
import { lerp as mlerp, rotateVector } from '~/_utils/math';

import SvgContour from './SvgContour';
import SvgFont from './SvgFont';
import SvgGlyph from './SvgGlyph';
import SvgContourSelection from './SvgContourSelection';

import actions from '~/actions';

import memoize from '~/_utils/memoize';

const componentMap = {
  contour: SvgContour,
  font: SvgFont,
  glyph: SvgGlyph,
};

const selectionComponentMap = {
  contour: SvgContourSelection,
}

export function renderSvgChild(childId) {
  const { id } = this.props;
  const childType = getNodeType(childId);
  const SvgNode = componentMap[childType];

  return [
    <SvgNode key={childId} id={childId} parentId={id} />,
  ];
}

export function renderSelectionAreas(childId) {
  const { id } = this.props;
  const childType = getNodeType(childId);
  const SvgNode = selectionComponentMap[childType];

  return [
    <SvgNode key={childId} id={childId} parentId={id} />,
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
      sPoint += `M ${start.x || 0},${start.y || 0}`;
    }

    if ( end ) {
      sPoint +=
        `C ${c1.x || 0},${c1.y || 0} ${c2.x || 0},${c2.y || 0} ${end.x || 0} ${end.y || 0}`;
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


//A lot of the code here is from pomax bezier.js library except it is not using
//retention. And so doesn't need the creation of bezier object.
//The license of bezier.js is MIT and so is this

export const NULL_VEC = {x: 0, y: 0};

export function getNearPath(coord, contour, nodes, error) {
  if ( !(contour in nodes) ) {
    return undefined;
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
        ...point._ghost,
      }
    }

    const distance = dist(point,coord);
    if ( distance < error) {
      return point.id;
    }
  }

  return undefined;
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
    y: a * c0.y + b * c1.y + c * c2.y + d * c3.y,
  }

  return result;
}

export function getPathBbox(pathId, nodes) {
  const node = nodes[pathId];
  const result = {
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity,
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
    maxY: yMinMax.max,
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
        y: c * (p[j+1].y - p[j].y),
      };
      list.push(dpt);
    }
    points.push(list);
    p = list;
  }
  return points;
}

export const getCurveOutline = memoize((c0, c1, c2, c3, steps) => {
  let n, c;
  let tangentPointsOn = [], tangentPointsOff = [];
  //get the first offcurve tangent
  ({ n, c } = bezierOffset(c0, c1, c2, c3, 0, c0.expand));
  if (!Number.isNaN(n.x) && !Number.isNaN(c.x)) {
    n = rotateVector(n.x, n.y, c0.angle%360);
    tangentPointsOn.push(c.x + n.x * (c0.distrib * c0.expand));
    tangentPointsOn.push(c.y + n.y * (c0.distrib * c0.expand));
    tangentPointsOff.push(c.x - n.x * ((1 - c0.distrib) * c0.expand));
    tangentPointsOff.push(c.y - n.y * ((1 - c0.distrib) * c0.expand));
  }
  //interpolate on the curve
  for (let i = 1; i < steps; i++) {
    ({ n, c } = bezierOffset(c0, c1, c2, c3, i/steps, mlerp(c0.expand, c3.expand, i/steps)));
    if (!Number.isNaN(n.x) && !Number.isNaN(c.x)) {
      n = rotateVector(n.x, n.y, mlerp(c0.angle%360, c3.angle%360, i/steps));
      tangentPointsOn.push(c.x + n.x * (mlerp(c0.distrib, c3.distrib, i/steps) * mlerp(c0.expand, c3.expand, i/steps)));
      tangentPointsOn.push(c.y + n.y * (mlerp(c0.distrib, c3.distrib, i/steps) * mlerp(c0.expand, c3.expand, i/steps)));
      tangentPointsOff.push(c.x - n.x * ((1 - mlerp(c0.distrib, c3.distrib, i/steps)) * mlerp(c0.expand, c3.expand, i/steps)));
      tangentPointsOff.push(c.y - n.y * ((1 - mlerp(c0.distrib, c3.distrib, i/steps)) * mlerp(c0.expand, c3.expand, i/steps)));
    }
  }
  //get the last offcurve tangent
  ({ n, c } = bezierOffset(c0, c1, c2, c3, 1, c3.expand));
  if (!Number.isNaN(n.x) && !Number.isNaN(c.x)) {
    n = rotateVector(n.x, n.y, c3.angle%360);
    tangentPointsOn.push(c.x + n.x * (c3.distrib * c3.expand));
    tangentPointsOn.push(c.y + n.y * (c3.distrib * c3.expand));
    tangentPointsOff.push(c.x - n.x * ((1 - c3.distrib) * c3.expand));
    tangentPointsOff.push(c.y - n.y * ((1 - c3.distrib) * c3.expand));
  }
  let tangentOutlineOn = getCurvePoints(tangentPointsOn, 0.5,25,false);
  let tangentOutlineOff = getCurvePoints(tangentPointsOff, 0.5,25,false);
  let points = '';
  points = points.concat(`${tangentOutlineOn[0]},${tangentOutlineOn[1]} `);
  for (let i = 2; i < tangentOutlineOn.length - 2; i+=2) {
    points = points.concat(`${tangentOutlineOn[i]},${tangentOutlineOn[i+1]} `);
  }
  points = points.concat(`${tangentOutlineOn[tangentOutlineOn.length - 2]},${tangentOutlineOn[tangentOutlineOn.length-1]} `);
  points = points.concat(`${tangentOutlineOn[tangentOutlineOff.length - 2]},${tangentOutlineOn[tangentOutlineOff.length-1]} `);
  for (let i = tangentOutlineOff.length - 1; i > 1; i-=2) {
    points = points.concat(`${tangentOutlineOff[i-1]}, ${tangentOutlineOff[i]} `);
  }
  points = points.concat(`${tangentOutlineOff[0]},${tangentOutlineOff[1]} `);
  return points;
});

// Find the intersection of two rays.
// A ray is defined by a point and an angle.
// Imported from Prototypo.js
export function rayRayIntersection ( p1, a1, p2, a2 ) {
	// line equations
	var a = Math.tan(a1),
		b = Math.tan(a2),
		c = p1.y - a * p1.x,
		d = p2.y - b * p2.x,
		x,
		y;

	// When searching for lines intersection,
	// angles can be normalized to 0 < a < PI
	// This will be helpful in detecting special cases below.
	a1 = a1 % Math.PI;
	if ( a1 < 0 ) {
		a1 += Math.PI;
	}
	a2 = a2 % Math.PI;
	if ( a2 < 0 ) {
		a2 += Math.PI;
	}

	// no intersection
	if ( a1 === a2 ) {
		return null;
	}

	//We want to round a1, a2 and PI to avoid problems with approximation
	a1 = a1.toFixed(6);
	a2 = a2.toFixed(6);
	var piOver2 = (Math.PI / 2).toFixed(6);

	// Optimize frequent and easy special cases.
	// Without optimization, results would be incorrect when cos(a) === 0
	if ( a1 === 0 ) {
		y = p1.y;
	}
  else
  if ( a1 === piOver2 ) {
		x = p1.x;
	}
	if ( a2 === 0 ) {
		y = p2.y;
	}
  else
  if ( a2 === piOver2 ) {
		x = p2.x;
	}

	// easiest case
	if ( x !== undefined && y !== undefined ) {
		return new Float32Array([ x, y ]);
	}

	// other cases that can be optimized
	if ( a1 === 0 ) {
		return new Float32Array([ ( y - d ) / b, y ]);
	}
	if ( a1 === piOver2 ) {
		return new Float32Array([ x, b * x + d ]);
	}
	if ( a2 === 0 ) {
		return new Float32Array([ ( y - c ) / a, y ]);
	}
	if ( a2 === piOver2 ) {
		return new Float32Array([ x, a * x + c ]);
	}

	// intersection from two line equations
	// algo: http://en.wikipedia.org/wiki/Line–line_intersection#Given_the_equations_of_the_lines
	return new Float32Array([
		x = (d - c) / (a - b),
		// this should work equally well with ax+c or bx+d
		a * x + c,
	]);
}

function getRoots(p) {
  var a;
  var b;
  var c;
  var d;

  if(p.length === 3) {
    a = p[0];
    b = p[1];
    c = p[2];
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
    a = p[0];
    b = p[1];
    if(a!==b) {
      return [a/(a-b)];
    }
    return [];
  }

  return undefined;
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
    if(c[dim] < min) {
      min = c[dim];
    }
    if(c[dim] > max) {
      max = c[dim];
    }
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
    y: a * p[0].y + b * p[1].y + c * p[2].y,
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
            pass2 = [];
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

  // no shortcut: use 'de Casteljau' iteration.
  var q = hull(c0, c1, c2, c3, t1);
  var result = {
    left: {
      c0: q[0],
      c1: q[4],
      c2: q[7],
      c3: q[9],
    },
    right: {
      c0: q[9],
      c1: q[8],
      c2: q[6],
      c3: q[3],
    },
    span: q,
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
  return result < Math.PI/24;
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
      c3: np[3],
    };
  }

  // move control points by 'however much necessary to
  // ensure the correct tangent to endpoint'.
  [0,1].forEach(function(t) {
    var p = points[t+1];
    var ov = {
      x: p.x - o.x,
      y: p.y - o.y,
    };
    var rc = distanceFn ? distanceFn((t+1)/order) : d;
    if(distanceFn && !clockwise) {rc = -rc;}
    var m = Math.sqrt(ov.x*ov.x + ov.y*ov.y);
    ov.x /= m;
    ov.y /= m;
    np[t+1] = {
      x: p.x + rc*ov.x,
      y: p.y + rc*ov.y,
    }
  });
  return {
    c0: np[0],
    c1: np[1],
    c2: np[2],
    c3: np[3],
  };
}

function bezierClockwise(c0, c1, c2, c3) {
  return angle(c0, c3, c1) > 0;
}

export function bezierOffset(c0, c1, c2, c3, t, d) {
  const c = computePoint(c0, c1, c2, c3, t);
  const n = bezierNormal(c0, c1, c2, c3, t);
  return {
    c,
    n,
    x: c.x + n.x * d,
    y: c.y + n.y * d,
  }
}

export function bezierNormal(c0, c1, c2, c3, t) {
  const d = getDerivative(c0, c1, c2, c3, t);
  return normalizeVec({ x: -d.y, y: d.x });
}

function lli8(x1,y1,x2,y2,x3,y3,x4,y4) {
  const nx = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4);
  const ny = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4);
  const d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

  if(d===0) {
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
    y: v1.y + r * (v2.y - v1.y),
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
    }
    else {
      fcurves.push(scale(segment.c0, segment.c1, segment.c2, segment.c3, d1));
      bcurves.push(scale(segment.c0, segment.c1, segment.c2, segment.c3, -d2));
    }
    alen += slen;
  });

  // reverse the 'return' outline
  bcurves = bcurves.map(function({c0, c1, c2, c3}) {
    return {
      c0: c3,
      c1: c2,
      c2: c1,
      c3: c0,
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
    y: a.y + b.y,
  };
}

export function subtractVec(a, b) {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  };
}

export function multiplyVecByN(a, n) {
  return {
    x: a.x * n,
    y: a.y * n,
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


/*!	Curve calc function for canvas 2.3.6
 *	(c) Epistemex 2013-2016
 *	www.epistemex.com
 *	License: MIT
 */

/**
 * Calculates an array containing points representing a cardinal spline through given point array.
 * Points must be arranged as: [x1, y1, x2, y2, ..., xn, yn].
 *
 * There must be a minimum of two points in the input array but the function
 * is only useful where there are three points or more.
 *
 * The points for the cardinal spline are returned as a new array.
 *
 * @param {Array} points - point array
 * @param {Number} [tension=0.5] - tension. Typically between [0.0, 1.0] but can be exceeded
 * @param {Number} [numOfSeg=25] - number of segments between two points (line resolution)
 * @param {Boolean} [close=false] - Close the ends making the line continuous
 * @returns {Float32Array} New array with the calculated points that was added to the path
 */
export function getCurvePoints(points, tension, numOfSeg, close) {

	'use strict';

	if (typeof points === 'undefined' || points.length < 2) {return new Float32Array(0)}

	// options or defaults
	let _tension = typeof tension === 'number' ? tension : 0.5;
	let _numOfSeg = typeof numOfSeg === 'number' ? numOfSeg : 25;

	var pts,// for cloning point array
		i = 1,
		l = points.length,
		rPos = 0,
		rLen = (l-2) * _numOfSeg + 2 + (close ? 2 * _numOfSeg: 0),
		res = new Float32Array(rLen),
		cache = new Float32Array((_numOfSeg + 2) << 2),
		cachePtr = 4;

	pts = points.slice(0);

	if (close) {
		pts.unshift(points[l - 1]);// insert end point as first point
		pts.unshift(points[l - 2]);
		pts.push(points[0], points[1]);// first point as last point
	}
	else {
		pts.unshift(points[1]);// copy 1. point and insert at beginning
		pts.unshift(points[0]);
		pts.push(points[l - 2], points[l - 1]);// duplicate end-points
	}

	// cache inner-loop calculations as they are based on t alone
	cache[0] = 1;// 1,0,0,0

	for (; i < numOfSeg; i++) {

		var st = i / numOfSeg,
			st2 = st * st,
			st3 = st2 * st,
			st23 = st3 * 2,
			st32 = st2 * 3;

		cache[cachePtr++] =	st23 - st32 + 1;// c1
		cache[cachePtr++] =	st32 - st23;// c2
		cache[cachePtr++] =	st3 - 2 * st2 + st;// c3
		cache[cachePtr++] =	st3 - st2;// c4
	}

	cache[++cachePtr] = 1;// 0,1,0,0

	// calc. points
	parse(pts, cache, l, _tension);

	if (close) {
		//l = points.length;
		pts = [];
		pts.push(points[l - 4], points[l - 3],
        points[l - 2], points[l - 1],// second last and last
        points[0], points[1],
        points[2], points[3]);// first and second
		parse(pts, cache, 4, _tension);
	}

	function parse(pts, cache, l, tension) {

		for (var i = 2, t; i < l; i += 2) {

			var pt1 = pts[i],
				pt2 = pts[i+1],
				pt3 = pts[i+2],
				pt4 = pts[i+3],

				t1x = (pt3 - pts[i-2]) * tension,
				t1y = (pt4 - pts[i-1]) * tension,
				t2x = (pts[i+4] - pt1) * tension,
				t2y = (pts[i+5] - pt2) * tension,
				c = 0, c1, c2, c3, c4;

			for (t = 0; t < _numOfSeg; t++) {

				c1 = cache[c++];
				c2 = cache[c++];
				c3 = cache[c++];
				c4 = cache[c++];

				res[rPos++] = c1 * pt1 + c2 * pt3 + c3 * t1x + c4 * t2x;
				res[rPos++] = c1 * pt2 + c2 * pt4 + c3 * t1y + c4 * t2y;
			}
		}
	}

	// add last point
	l = close ? 0 : points.length - 2;
	res[rPos++] = points[l++];
	res[rPos] = points[l];

	return res
}
