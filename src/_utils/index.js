/*
 * This file gather utility functions that didn't fit anywhere else
 */
import Bezier from 'bezier-js/fp';

import Memoize from '~/_utils/Memoize';
import * as TwoD from '~/_utils/2D';

// linear interpolation between two values.
export function lerp1d(v0, v1, t) {
  return (1 - t) * v0 + t * v1;
}

// TODO: What is this function? What is it doing? How is it special?
export const getCurveOutline = Memoize((c0, c1, c2, c3, steps) => {
  let n, c;
  let tangentPointsOn = [], tangentPointsOff = [];
  let lerp1d =

  //get the first offcurve tangent
  ({ n, c } = Bezier.offset(c0, c1, c2, c3, 0, c0.expand));
  if (!Number.isNaN(n.x) && !Number.isNaN(c.x)) {
    n = TwoD.rotate(n, c0.angle%360);
    tangentPointsOn.push(c.x + n.x * (c0.distrib * c0.expand));
    tangentPointsOn.push(c.y + n.y * (c0.distrib * c0.expand));
    tangentPointsOff.push(c.x - n.x * ((1 - c0.distrib) * c0.expand));
    tangentPointsOff.push(c.y - n.y * ((1 - c0.distrib) * c0.expand));
  }
  //interpolate on the curve
  for (let i = 1; i < steps; i++) {
    ({ n, c } = Bezier.offset(c0, c1, c2, c3, i/steps, lerp1d(c0.expand, c3.expand, i/steps)));
    if (!Number.isNaN(n.x) && !Number.isNaN(c.x)) {
      n = TwoD.rotate(n, lerp1d(c0.angle%360, c3.angle%360, i/steps));
      tangentPointsOn.push(c.x + n.x * (lerp1d(c0.distrib, c3.distrib, i/steps) * lerp1d(c0.expand, c3.expand, i/steps)));
      tangentPointsOn.push(c.y + n.y * (lerp1d(c0.distrib, c3.distrib, i/steps) * lerp1d(c0.expand, c3.expand, i/steps)));
      tangentPointsOff.push(c.x - n.x * ((1 - lerp1d(c0.distrib, c3.distrib, i/steps)) * lerp1d(c0.expand, c3.expand, i/steps)));
      tangentPointsOff.push(c.y - n.y * ((1 - lerp1d(c0.distrib, c3.distrib, i/steps)) * lerp1d(c0.expand, c3.expand, i/steps)));
    }
  }
  //get the last offcurve tangent
  ({ n, c } = Bezier.offset(c0, c1, c2, c3, 1, c3.expand));
  if (!Number.isNaN(n.x) && !Number.isNaN(c.x)) {
    n = TwoD.rotate(n, c3.angle%360);
    tangentPointsOn.push(c.x + n.x * (c3.distrib * c3.expand));
    tangentPointsOn.push(c.y + n.y * (c3.distrib * c3.expand));
    tangentPointsOff.push(c.x - n.x * ((1 - c3.distrib) * c3.expand));
    tangentPointsOff.push(c.y - n.y * ((1 - c3.distrib) * c3.expand));
  }
  let tangentOutlineOn = getCurvePoints(tangentPointsOn, 0.5,25,false);
  let tangentOutlineOff = getCurvePoints(tangentPointsOff, 0.5,25,false);
  let inContour = '', outContour = '';
  //inContour = inContour.concat(`${tangentOutlineOn[0]},${tangentOutlineOn[1]} `);
  for (let i = 0; i < tangentOutlineOn.length; i+=2) {
    inContour = inContour.concat(`${tangentOutlineOn[i]},${tangentOutlineOn[i+1]} `);
  }
  //inContour = inContour.concat(`${tangentOutlineOn[tangentOutlineOn.length - 2]},${tangentOutlineOn[tangentOutlineOn.length-1]} `);
  //outContour = outContour.concat(`${tangentOutlineOn[tangentOutlineOff.length - 2]},${tangentOutlineOn[tangentOutlineOff.length-1]} `);
  for (let i = tangentOutlineOff.length - 1; i > 0; i-=2) {
    outContour = outContour.concat(`${tangentOutlineOff[i-1]}, ${tangentOutlineOff[i]} `);
  }
  //outContour = outContour.concat(`${tangentOutlineOff[0]},${tangentOutlineOff[1]} `);
  return {
    inContour: inContour,
    outContour: outContour,
  };
});

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

	if (typeof points === 'undefined' || points.length < 2) {return new Float32Array(0);}

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

	return res;
}

export function getTangentPoints(point, inControl) {
  //Get normal vector
  let normal = {x: inControl.x - point.x, y: inControl.y - point.y};
  normal = TwoD.rotate(normal, point.angle);
  //http://math.stackexchange.com/a/1630886
  let normalDistance = Math.sqrt(
    Math.pow((point.x - normal.y) - point.x, 2) + Math.pow((point.y + normal.x) - point.y, 2)
  );
  let distanceRatioIn = (point.expand * (1 - point.distrib)) / normalDistance;
  let distanceRatioOut = (point.expand * point.distrib) / normalDistance;

  let tanIn = {
    x: ((1 - distanceRatioIn) * point.x + distanceRatioIn * (point.x - normal.y)),
    y: ((1 - distanceRatioIn) * point.y + distanceRatioIn * (point.y + normal.x)),
  };
  let tanOut = {
    x: ((1 - distanceRatioOut) * point.x + distanceRatioOut * (point.x + normal.y)),
    y: ((1 - distanceRatioOut) * point.y + distanceRatioOut * (point.y - normal.x)),
  };
  return {
    in: tanIn,
    out: tanOut,
  };
}

export function getNodeControls(point, inControl) {
  if (inControl._isGhost) {
    inControl.x = inControl._ghost.x;
    inControl.y = inControl._ghost.y;
  }
  /******    Expand control (tangents)   *****/
  let tangents = getTangentPoints(point, inControl);
  /******    Distribution control (triangle)   *****/
  let distribControl1 = {
    x: point.x - 20,
    y: point.y + (point.expand * point.distrib)/2 - (point.expand * (1-point.distrib))/2,
  };
  let distribControl2 = {
    x: distribControl1.x,
    y: distribControl1.y + 10,
  };
  let distribControl3 = {
    x: distribControl1.x + 10,
    y: distribControl1.y,
  };
  let distribControl4 = {
    x: distribControl1.x,
    y: distribControl1.y - 10,
  };
  let angle = TwoD.lla({x: point.x + 100, y: point.y}, point, point, inControl);
  let pointAngle = point.angle * Math.PI/180;
  distribControl1= TwoD.rotateAroundDeg(distribControl1, - angle + pointAngle, point);
  distribControl2= TwoD.rotateAroundDeg(distribControl2, - angle + pointAngle, point);
  distribControl3= TwoD.rotateAroundDeg(distribControl3, - angle + pointAngle, point);
  distribControl4= TwoD.rotateAroundDeg(distribControl4, - angle + pointAngle, point);
  /******    Angle control (arc)   *****/
  let angleControl1 = {
    x: point.x + 20,
    y: point.y + 15 + (point.expand * point.distrib)/2 - (point.expand * (1-point.distrib))/2,
  };
  let angleControl2 = {
    x: angleControl1.x + 10,
    y: angleControl1.y - 10,
  };
  let angleControl3 = {
    x: angleControl1.x + 10,
    y: angleControl1.y - 20,
  };
  let angleControl4 = {
    x: angleControl1.x,
    y: angleControl1.y - 30,
  };
  angleControl1= TwoD.rotateAroundDeg(angleControl1, - angle + pointAngle, point);
  angleControl2= TwoD.rotateAroundDeg(angleControl2, - angle + pointAngle, point);
  angleControl3= TwoD.rotateAroundDeg(angleControl3, - angle + pointAngle, point);
  angleControl4= TwoD.rotateAroundDeg(angleControl4, - angle + pointAngle, point);

  return {
    point : point,
    expand: {
      in: tangents.in,
      out: tangents.out,
    },
    distribution: {
      first: distribControl1,
      second: distribControl2,
      third: distribControl3,
      fourth: distribControl4,
    },
    angle: {
      first: angleControl1,
      second: angleControl2,
      third: angleControl3,
      fourth: angleControl4,
    },
  };
}
