import {UPDATE_Y} from './../const';

export default function(nodeId, value) {
  return { type: UPDATE_Y, nodeId, propNames: ['y'], value };
}
