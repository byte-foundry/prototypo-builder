import {UPDATE_TMP_FORMULA} from './../const';

module.exports = function(propPath, formula) {
  return { type: UPDATE_TMP_FORMULA, propPath, formula };
};
