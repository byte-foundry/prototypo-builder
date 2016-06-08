import {DELETE_FORMULA} from './../const';

module.exports = function(glyphId, propPath) {
  return { type: DELETE_FORMULA, glyphId, propPath };
};
