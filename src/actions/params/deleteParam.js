import {DELETE_PARAM} from './../const';

export default function(nodeId, name) {
  return { type: DELETE_PARAM, nodeId, name };
}
