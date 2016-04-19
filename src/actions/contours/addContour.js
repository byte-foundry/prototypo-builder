import {ADD_CONTOUR} from './../const';

module.exports = function(nodeId, childId) {
  return { type: ADD_CONTOUR, nodeId, childId, childType: 'contour' };
};
