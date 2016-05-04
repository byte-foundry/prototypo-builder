import {ADD_PARAM} from './../const';

module.exports = function(nodeId, name, param) {
  return { type: ADD_PARAM, nodeId, name, param };
};
