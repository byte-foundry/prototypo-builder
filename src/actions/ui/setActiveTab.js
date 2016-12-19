import {SET_ACTIVE_TAB} from './../const';

export default function(type, glyph = undefined) {
  return { type: SET_ACTIVE_TAB, tab: {type: type, glyph: glyph} };
}
