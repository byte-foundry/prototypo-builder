import {UPDATE_TMP_FORMULA} from './../const';

module.exports = function(name, value) {
  return { type: UPDATE_TMP_FORMULA, name, value };
};
