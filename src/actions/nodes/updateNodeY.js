import {UPDATE_NODE_Y} from './../const';

module.exports = function(nodeId, parentId, value) {
  return { type: UPDATE_NODE_Y, nodeId, parentId, value };
};
