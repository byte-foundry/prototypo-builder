import { MOVE_NODE } from './../const';

module.exports = function(nodeId, parentId, { dx = 0, dy = 0 }) {
  return { type: MOVE_NODE, nodeId, parentId, dx, dy};
};
