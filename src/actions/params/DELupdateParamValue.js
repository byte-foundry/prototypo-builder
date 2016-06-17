import {UPDATE_PARAM_VALUE} from './../const';

module.exports = function(nodeId, name, value) {
  return { type: UPDATE_PARAM_VALUE, nodeId, name, value };
};
