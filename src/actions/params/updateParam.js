import {UPDATE_PARAM} from './../const';

export default function(nodeId, name, props) {
  return { type: UPDATE_PARAM, nodeId, name, props };
}
