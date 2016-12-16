import {ADD_CONTOUR} from './../const';

export default function(nodeId, childId) {
  return { type: ADD_CONTOUR, nodeId, childId, childType: 'contour' };
}
