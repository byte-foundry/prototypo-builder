import {ADD_PARAM} from './../const';

module.exports = function(nodeId, name, config) {
  return { type: ADD_PARAM, nodeId, name, config };
};
