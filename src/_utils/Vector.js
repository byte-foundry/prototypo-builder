/*
 * A very basic collection of 2d vector methods
 * TODO: this file is very simple but it should be tested!
 * #goodFirstBug
 */
// Some vector methods are already implemented and tested in
// Bezier.js' utils. Reuse them.
import Bezier from 'bezier-js/fp';

const NULL_VEC = {x: 0, y: 0};

const { dist, lerp } = Bezier.getUtils();
export { dist, lerp };

export function add(a, b) {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  };
}

export function subtract(a, b) {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  };
}

export function multiply(a, n) {
  return {
    x: a.x * n,
    y: a.y * n,
  };
}

export function isEqual(a, b) {
  return a.x === b.x && a.y === b.y;
}

export function normalize(a) {
  const norm = dist(a, NULL_VEC);

  return multiply(a, 1 / norm);
}

export function dot(a, b) {
  return a.x * b.x + a.y * b.y;
}
