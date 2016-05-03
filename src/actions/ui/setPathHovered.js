import {SET_PATH_HOVERED} from '../const';

module.exports = function(path, parent) {
  return { type: SET_PATH_HOVERED, path, parent };
}
