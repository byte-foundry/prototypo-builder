import {SET_COORDS} from '../const';

export default function(x, y) {
  return { type: SET_COORDS, x, y };
}
