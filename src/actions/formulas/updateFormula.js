import {UPDATE_FORMULA} from './../const';

export default function(glyphId, propPath, formula) {
  return { type: UPDATE_FORMULA, glyphId, propPath, formula };
}
