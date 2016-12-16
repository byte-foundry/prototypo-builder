import {UPDATE_TMP_FORMULA} from './../const';

export default function(name, value) {
  return { type: UPDATE_TMP_FORMULA, name, value };
}
