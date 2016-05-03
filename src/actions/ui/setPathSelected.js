import {SET_PATH_SELECTED} from '../const';

module.exports = function(path, parent) {
  return { type: SET_PATH_SELECTED, path, parent };
}
