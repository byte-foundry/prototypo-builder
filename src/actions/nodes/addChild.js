import {ADD_CHILD} from './../const';

module.exports = function(nodeId, childId) {
  return { type: ADD_CHILD, nodeId, childId };
};
