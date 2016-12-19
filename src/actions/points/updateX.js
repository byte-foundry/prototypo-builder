import {UPDATE_X} from './../const';

export default function(nodeId, value) {
  return { type: UPDATE_X, nodeId, propNames: ['x'], value };
}
