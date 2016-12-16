import {ADD_FONT} from './../const';

export default function(nodeId, childId) {
  return { type: ADD_FONT, nodeId, childId, childType: 'font' };
}
