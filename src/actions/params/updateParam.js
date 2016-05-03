import {UPDATE_PARAM} from './../const';

module.exports = function(nodeId, name, value) {
  return { type: UPDATE_PARAM, nodeId, name, value };
};
