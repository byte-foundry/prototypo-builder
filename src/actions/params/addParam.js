import {ADD_PARAM} from './../const';

module.exports = function(nodeId, name, value, meta) {
  return { type: ADD_PARAM, nodeId, name, value, meta };
};
