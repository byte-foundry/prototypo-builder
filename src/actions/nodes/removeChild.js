import {REMOVE_CHILD} from './../const';

export default function(nodeId, childId) {
  return { type: REMOVE_CHILD, nodeId, childId };
}
