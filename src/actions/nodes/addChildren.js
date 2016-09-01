import {ADD_CHILDREN} from './../const';

module.exports = function(nodeId, childIds, childTypes) {
  return {
    type: ADD_CHILDREN,
    nodeId,
    childIds,
    childTypes,
  };
};
