import {CREATE_GLYPH} from './../const';
import createNode from './../nodes/createNode';

module.exports = function() {
  const action = createNode({ nodeType: 'glyph' });
  action.type = CREATE_GLYPH;
  return action;
};
