import {SET_PATH_SELECTED} from '../const';

export default function(path, parent) {
  return { type: SET_PATH_SELECTED, path, parent };
}
