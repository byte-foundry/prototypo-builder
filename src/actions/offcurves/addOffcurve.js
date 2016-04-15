import {ADD_OFFCURVE} from './../const';

module.exports = function(nodeId, childId) {
  return { type: ADD_OFFCURVE, nodeId, childId };
};
