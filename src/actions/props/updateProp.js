import {UPDATE_PROP} from './../const';

export default function(nodeId, propName, value) {
  return { type: UPDATE_PROP, nodeId, propNames: [propName], value };
}
