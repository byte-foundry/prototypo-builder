import {UPDATE_COORDS} from './../const';

module.exports = function(nodeId, x, y) {
  const coords = (
    Array.isArray(x) ?
      { x: x[0], y: x[1] } :
      typeof x === 'object' ?
        x :
        { x, y }
  );

  return { type: UPDATE_COORDS, nodeId, propNames: ['x','y'], coords };
};
