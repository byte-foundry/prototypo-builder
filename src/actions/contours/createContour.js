import {CREATE_CONTOUR} from './../const';
import createNode from './../nodes/createNode';

module.exports = function() {
  const action = createNode({ nodeType: 'contour' });
  action.type = CREATE_CONTOUR;
  return action;
};
