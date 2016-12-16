import {ADD_CHILD} from './../const';

export default function(nodeId, childId, childType) {
  return { type: ADD_CHILD, nodeId, childId, childType };
}
