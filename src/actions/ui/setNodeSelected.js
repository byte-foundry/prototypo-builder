import {SET_NODE_SELECTED} from '../const';

export default function(point, parent) {
  return { type: SET_NODE_SELECTED, point, parent};
}
