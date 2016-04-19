import {ADD_ONCURVE} from './../const';

module.exports = function(nodeId, childId) {
  return { type: ADD_ONCURVE, nodeId, childId, childType: 'oncurve' };
};
