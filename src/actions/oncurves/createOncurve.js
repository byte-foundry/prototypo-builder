import {CREATE_ONCURVE} from './../const';
import createNode from './../nodes/createNode';

module.exports = function() {
  const action = createNode({ nodeType: 'oncurve' });
  action.type = CREATE_ONCURVE;
  return action;
};
