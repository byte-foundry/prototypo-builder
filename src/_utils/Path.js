/*
 * A collection of utilities to work on paths
 */
import Bezier from 'bezier-js/fp';

import * as Path from '~/_utils/Path';
import * as Vector from '~/_utils/Vector';
import * as Utils from '~/_utils/';

// Loop on a path and group each oncurve with two following offcurves
// returns a new path
export function mapCurve(nodeId, nodes, callback, dontMap) {
  const { childIds, isClosed } = nodes[nodeId];
  const length = ( childIds.length -1 ) / 3;
  const result = [];
  let curr;

  for ( let i = 0 ; i < childIds.length-1 ; i+=3 ) {
    if (isClosed && i + 3 === childIds.length - 1) {
      //we want to return the first node instead of the last here
      curr = callback(
        nodes[childIds[i]],
        nodes[childIds[i+1]],
        nodes[childIds[i+2]],
        nodes[childIds[0]],
        i / 3,
        length
      );
    }
    else {
      curr = callback(
        nodes[childIds[i]],
        nodes[childIds[i+1]],
        nodes[childIds[i+2]],
        nodes[childIds[i+3]],
        i / 3,
        length
      );
    }

    if ( !dontMap ) {
      result.push(curr);
    }
  }

  return dontMap ? undefined : result;
}

export function forEachCurve() {
  mapCurve(...arguments, true);
}

// Loop on a path and group each oncurve with previous offcurve and next offcurve
// returns a new path
export function mapNode(nodeId, nodes, callback, dontMap) {
  const { childIds, isClosed } = nodes[nodeId];
  const length = Math.floor( childIds.length / 3 ) + 1;
  const result = [];
  let curr;

  for ( let i = 0; i < childIds.length ; i+=3 ) {
    if ( childIds.length === 1 ) {
      curr = callback(
        nodes[childIds[i]],
        null,
        null,
        i / 3,
        length
      );
    }
    else if ( i === 0 ) {
      curr = callback(
        nodes[childIds[i]],
        isClosed ? nodes[childIds[childIds.length-2]] : null,
        nodes[childIds[i+1]],
        i / 3,
        length
      );
    }
    else if ( i === childIds.length-1 ) {
      curr = callback(
        isClosed ? nodes[childIds[0]] : nodes[childIds[i]],
        nodes[childIds[i-1]],
        isClosed ? nodes[childIds[1]] : null,
        i / 3,
        length
      );
    }
    else {
      curr = callback(
        nodes[childIds[i]],
        nodes[childIds[i-1]],
        nodes[childIds[i+1]],
        i / 3,
        length
      );
    }

    if ( !dontMap ) {
      result.push(curr);
    }
  }

  return dontMap ? undefined : result;
}

export function forEachNode() {
  return mapNode(...arguments, true);
}

// Return a
export function getNode(pathId, childId, nodes) {
  const { childIds, isClosed } = nodes[pathId];
  let i = childIds.indexOf(childId);

  if ( i === -1 ) {
    throw new Error('This node is not a child of this path');
  }
  // if the provided child isn't an oncurve
  if ( i % 3 !== 0 ) {
    // find the related oncurve
    i = i%3 === 1 ? i - 1 : i + 1;
  }

  if ( childIds.length === 1 ) {
    return [
      nodes[childIds[i]],
      null,
      null,
    ];
  }
  else if ( i === 0 ) {
    return [
      nodes[childIds[i]],
      isClosed ? nodes[childIds[childIds.length - 2]] : null,
      nodes[childIds[i + 1]],
      // When the path is closed, we also return the last oncurve of the path
      // This is very useful when we want to translate that node.
      isClosed ? nodes[childIds[childIds.length - 1]] : null,
    ];
  }
  else if ( i === childIds.length - 1 ) {
    return [
      isClosed ? nodes[childIds[0]] : nodes[childIds[i]],
      nodes[childIds[i - 1]],
      isClosed ? nodes[childIds[1]] : null,
      // When the path is closed, we also return the first oncurve of the path
      // This is very useful when we want to translate that node.
      isClosed ? nodes[childIds[childIds.length - 1]] : null,
    ];
  }
  else {
    return [
      nodes[childIds[i]],
      nodes[childIds[i - 1]],
      nodes[childIds[i + 1]],
    ];
  }
}

// Given a pathId and an oncurveId, return the previous bezier node
export function getPrevNode(pathId, oncurveId, nodes) {
  const currentPos = nodes[pathId].childIds.indexOf(oncurveId);

  if (currentPos === 0) {
    return [undefined, undefined, undefined];
  }

  const newPos = currentPos - 3;

  return getNode(pathId, nodes[pathId].childIds[newPos], nodes);
}

// Given a pathId and an oncurveId, return the next bezier node
export function getNextNode(pathId, oncurveId, nodes) {
  const currentPos = nodes[pathId].childIds.indexOf(oncurveId);

  if (currentPos === nodes[pathId].childIds.length - 2 ) {
    return [undefined, undefined, undefined];
  }

  const newPos = currentPos + 3;

  return getNode(pathId, nodes[pathId].childIds[newPos], nodes);
}

// Calculates the bbox of a path
export function bbox(pathId, nodes) {
  let resX = { min: Infinity, max: -Infinity };
  let resY = { min: Infinity, max: -Infinity };

  forEachCurve(pathId, nodes, (c0, c1, c2, c3) => {
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

export function findClosestPath(coord, contour, nodes, error = 30) {
  if ( !(contour in nodes) ) {
    return undefined;
  }

  let result;

  nodes[contour].childIds.forEach((key) => {
    const node = nodes[key];

    if (node.type === 'path') {
      Path.forEachCurve(node.id, nodes, (c0, c1, c2, c3) => {
        if (!result && c2 && c3) {
          const on = Bezier.crosses([c0, c1, c2, c3], coord, error);

          if (on) {
            result = node.id;
          }
        }
      });
    }
  });
  return result;
}

export function findClosestNode(coord, pathId, nodes, error = 35) {
  const path = nodes[pathId];
  const length = path.isClosed ? path.childIds.length - 1 : path.childIds.length;

  for (let i = 0; i < length; i++) {
    let point = nodes[path.childIds[i]];

    if (point._isGhost) {
      point = {
        ...point,
        ...point._ghost,
      };
    }

    const distance = Vector.dist(point,coord);

    if ( distance < error) {
      if (point.type === 'oncurve' && point.x) {
        // An oncurve is selected. Reduce the error to find which control is hovered
        let error = 8;
        let control;

        if (nodes[path.childIds[i-1]]){
          control = nodes[path.childIds[i-1]];
        }
        else {
          control = nodes[path.childIds[i+1]];
        }
        let controls = Utils.getNodeControls(point, control);
        let distribMiddle = {
          x: (controls.distribution.first.x + controls.distribution.third.x) / 2,
          y: (controls.distribution.first.y + controls.distribution.third.y) / 2,
        };
        let angleMiddle = {
          x: (controls.angle.second.x + controls.angle.third.x) / 2,
          y: (controls.angle.second.y + controls.angle.third.y) / 2,
        };
        const distanceInExpand = Vector.dist(controls.expand.in, coord);
        const distanceOutExpand = Vector.dist(controls.expand.out, coord);
        const distanceDistrib = Vector.dist(distribMiddle, coord);
        const distanceAngle = Vector.dist(angleMiddle, coord);

        if (distanceInExpand < error) {
          return {type: 'expandControl', point: controls.expand.in, baseNode: point};
        }
        else if (distanceOutExpand < error) {
          return {type: 'expandControl', point: controls.expand.out, baseNode: point};
        }
        else if (distanceDistrib < error) {
          return {type: 'distribControl', point: distribMiddle, baseNode: point};
        }
        else if (distanceAngle < error) {
          return {type: 'angleControl', point: angleMiddle, baseNode: point};
        }
        else {
          return {type: 'node', point: point};
        }
      }
      else {
        return {type: 'node', point: point};
      }
    }
  }

  return undefined;
}
