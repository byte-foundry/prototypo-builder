import {CREATE_PATH} from './../const';
import createNode from './../nodes/createNode';

module.exports = function() {
  const action = createNode({ nodeType: 'path' });
  action.type = CREATE_PATH;
  return action;
};
