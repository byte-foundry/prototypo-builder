import {CREATE_FONT} from './../const';
import createNode from './../nodes/createNode';

module.exports = function() {
  const action = createNode({ nodeType: 'font' });
  action.type = CREATE_FONT;
  return action;
};
