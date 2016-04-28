import {SET_COORDS} from '../const';

module.exports = function(x, y) {
  return { type: SET_COORDS, x, y };
}
