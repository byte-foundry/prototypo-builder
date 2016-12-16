import {SET_PATH_HOVERED} from '../const';

export default function(path, parent) {
  return { type: SET_PATH_HOVERED, path, parent };
}
