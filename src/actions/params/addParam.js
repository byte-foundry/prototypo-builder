import {ADD_PARAM} from './../const';

export default function(nodeId, name, props) {
  return { type: ADD_PARAM, nodeId, name, props };
}
