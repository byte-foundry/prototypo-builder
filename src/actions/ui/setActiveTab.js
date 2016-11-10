import {SET_ACTIVE_TAB} from './../const';
module.exports = function(type, glyph = undefined) {
  return { type: SET_ACTIVE_TAB, tab: {type: type, glyph: glyph} };
};
