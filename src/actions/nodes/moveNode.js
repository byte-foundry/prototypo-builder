import { MOVE_NODE } from './../const';

export default function(nodeId, parentId, { dx = 0, dy = 0 }) {
  return { type: MOVE_NODE, nodeId, parentId, dx, dy};
}
