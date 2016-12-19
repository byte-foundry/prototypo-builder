import {ADD_CHILDREN} from './../const';

export default function(nodeId, childIds, childTypes) {
  return {
    type: ADD_CHILDREN,
    nodeId,
    childIds,
    childTypes,
  };
}
