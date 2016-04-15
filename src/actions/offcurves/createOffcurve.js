import {CREATE_OFFCURVE} from './../const';
import createNode from './../nodes/createNode';

module.exports = function() {
  const action = createNode({ nodeType: 'offcurve' });
  action.type = CREATE_OFFCURVE;
  return action;
};
