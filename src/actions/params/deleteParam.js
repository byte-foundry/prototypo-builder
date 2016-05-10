import {DELETE_PARAM} from './../const';

module.exports = function(nodeId, name) {
  return { type: DELETE_PARAM, nodeId, name };
};
