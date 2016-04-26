import {UPDATE_NODE_X} from './../const';

module.exports = function(nodeId, parentId, value) {
  return { type: UPDATE_NODE_X, nodeId, value };
};
