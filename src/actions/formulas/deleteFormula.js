import {DELETE_FORMULA} from './../const';

export default function(nodeId, propPath) {
  return { type: DELETE_FORMULA, nodeId, propPath };
}
