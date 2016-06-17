import {UPDATE_FORMULA} from './../const';

module.exports = function(glyphId, propPath, formula) {
  return { type: UPDATE_FORMULA, glyphId, propPath, formula };
};
