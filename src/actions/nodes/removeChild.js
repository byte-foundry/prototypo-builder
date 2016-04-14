import {REMOVE_CHILD} from './../const';

module.exports = function(nodeId, childId) {
  return { type: REMOVE_CHILD, nodeId, childId };
};
