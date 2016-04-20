import {ADD_CURVE} from './../const';

module.exports = function(nodeId, childIds) {
  return {
    type: ADD_CURVE,
    nodeId,
    childIds,
    childTypes: ['offcurve', 'oncurve']
  };
};
