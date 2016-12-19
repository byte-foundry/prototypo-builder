import {SET_NODE_HOVERED} from '../const';

export default function(point, parent) {
  return { type: SET_NODE_HOVERED, point, parent};
}
