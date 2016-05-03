import {SET_NODE_HOVERED} from '../const';

module.exports = function(point, parent) {
  return { type: SET_NODE_HOVERED, point, parent};
}
