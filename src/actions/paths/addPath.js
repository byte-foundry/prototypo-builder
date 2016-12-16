import {ADD_PATH} from './../const';

export default function(nodeId, childId) {
  return { type: ADD_PATH, nodeId, childId, childType: 'path' };
}
