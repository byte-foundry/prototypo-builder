import {SET_NODE_SELECTED} from '../const';

module.exports = function(point, parent) {
  return { type: SET_NODE_SELECTED, point, parent};
}
