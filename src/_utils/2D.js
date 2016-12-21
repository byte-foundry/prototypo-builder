/*
 * This file gathers methods for working with 2D objects (point, line)
 * TODO: write unit tests FFS!
 */
import Bezier from 'bezier-js/fp';

import * as Vector from '~/_utils/Vector';
import * as Path from '~/_utils/Path';


// Line-Line angle
// Returns the value of the angle ∠AOD, O being the intersection of (AB) with (CD)
export function lineLineAngle(A, B, C, D) {
  let dx1 = A.x - B.x;
  let dy1 = A.y - B.y;
  let dx2 = D.x - C.x;
  let dy2 = D.y - C.y;
  let cross = dx1*dy2 - dy1*dx2;
  let dot = dx1*dx2 + dy1*dy2;

  return Math.atan2(cross, dot);
}

// Ray-ray intersection. A ray is defined by a point and an angle
export function rayRayIntersection( p1, _a1, p2, _a2 ) {
  // line equations
  const a = Math.tan(_a1);
  const b = Math.tan(_a2);
  let c = p1.y - a * p1.x;
  let d = p2.y - b * p2.x;
  let x;
  let y;

  // When searching for lines intersection,
  // angles can be normalized to 0 < a < PI
  // This will be helpful in detecting special cases below.
  let a1 = _a1 % Math.PI;

  if ( a1 < 0 ) {
    a1 += Math.PI;
  }
  let a2 = _a2 % Math.PI;

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
  let piOver2 = (Math.PI / 2).toFixed(6);

  // Optimize frequent and easy special cases.
  // Without optimization, results would be incorrect when cos(a) === 0
  if ( a1 === 0 ) {
    y = p1.y;
  }
  else if ( a1 === piOver2 ) {
    x = p1.x;
  }
  if ( a2 === 0 ) {
    y = p2.y;
  }
  else if ( a2 === piOver2 ) {
    x = p2.x;
  }

  // easiest case
  if ( x !== undefined && y !== undefined ) {
    return { x, y };
  }

  // other cases that can be optimized
  if ( a1 === 0 ) {
    return { x: ( y - d ) / b, y };
  }
  if ( a1 === piOver2 ) {
    return { x, y: b * x + d };
  }
  if ( a2 === 0 ) {
    return { x: ( y - c ) / a, y };
  }
  if ( a2 === piOver2 ) {
    return { x, y: a * x + c };
  }

  // intersection from two line equations
  // algo: http://en.wikipedia.org/wiki/Line–line_intersection#Given_the_equations_of_the_lines
  x = (d - c) / (a - b);
  // this should work equally well with ax+c or bx+d
  y = a * x + c;

  return { x, y };
}

export function rotate(p, angle) {
  var cosP = Math.cos(angle);
  var sinP = Math.sin(angle);

  return {
    x: cosP * p.x - sinP * p.y,
    y: sinP * p.x + cosP * p.y,
  };
}

const DegToRad = Math.PI / 180;

export function rotateDeg(p, degAngle) {
  return rotate(p, (degAngle * DegToRad));
}

// rotate a point around another point
export function rotateAround(point, angle, center) {
  return Vector.add(
    rotate( Vector.subtract(point, center), angle ),
    center
  );
}

export function rotateAroundDeg(point, degAngle, center) {
  return rotateAround(point, degAngle * DegToRad, center);
}

// Calculates the bbox of a path
export function bbox(pathId, nodes) {
  let resX = { min: Infinity, max: -Infinity };
  let resY = { min: Infinity, max: -Infinity };

  Path.forEachCurve(pathId, nodes, (c0, c1, c2, c3) => {
    if (c2 && c3) {
      const bbox = Bezier.bbox([c0, c1, c2, c3]);

      if ( bbox.x.min < resX.min ) {
        resX.min = bbox.x.min;
      }
      if ( bbox.y.min < resY.min ) {
        resY.min = bbox.y.min;
      }
      if ( bbox.x.max > resX.max ) {
        resX.max = bbox.x.max;
      }
      if ( bbox.y.max > resY.max ) {
        resY.max = bbox.y.max;
      }
    }
  });

  return {
    x: {
      min: resX.min,
      max: resX.max,
      mid: (resX.min + resX.max) / 2,
      size: resX.max - resX.min,
    },
    y: {
      min: resY.min,
      max: resY.max,
      mid: (resY.min + resY.max) / 2,
      size: resY.max - resY.min,
    },
  };
}
