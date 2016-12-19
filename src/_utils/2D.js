/*
 * This file gathers methods for working with 2D objects (point, line)
 * TODO: write unit tests FFS!
 */
import * as Vector from '~/_utils/Vector';

// Line-Line angle
export function lla(A, B, C, D) {
  let dx1 = A.x - B.x;
  let dy1 = A.y - B.y;
  let dx2 = C.x - D.x;
  let dy2 = C.y - D.y;
  let cross = dx1*dy2 - dy1*dx2;
  let dot = dx1*dx2 + dy1*dy2;

  return Math.atan2(cross, dot);
}

// Ray-ray intersection. A ray is defined by a point and an angle
export function rri( p1, _a1, p2, _a2 ) {
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
    return [ x, y ];
  }

  // other cases that can be optimized
  if ( a1 === 0 ) {
    return [ ( y - d ) / b, y ];
  }
  if ( a1 === piOver2 ) {
    return [ x, b * x + d ];
  }
  if ( a2 === 0 ) {
    return [ ( y - c ) / a, y ];
  }
  if ( a2 === piOver2 ) {
    return [ x, a * x + c ];
  }

  // intersection from two line equations
  // algo: http://en.wikipedia.org/wiki/Line–line_intersection#Given_the_equations_of_the_lines
  return [
    x = (d - c) / (a - b),
    // this should work equally well with ax+c or bx+d
    a * x + c,
  ];
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
