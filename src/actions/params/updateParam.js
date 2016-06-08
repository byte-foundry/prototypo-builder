import {UPDATE_PARAM} from './../const';

module.exports = function(nodeId, name, props) {
  return { type: UPDATE_PARAM, nodeId, name, props };
};
