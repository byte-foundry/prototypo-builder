import {ADD_CHILD} from './../const';

module.exports = function(nodeId, childId, childType) {
  return { type: ADD_CHILD, nodeId, childId, childType };
};
