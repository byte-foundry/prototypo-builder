import {ADD_PARAM} from './../const';

module.exports = function(nodeId, name, props) {
  return { type: ADD_PARAM, nodeId, name, props };
};
