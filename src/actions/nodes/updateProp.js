import {UPDATE_PROP} from './../const';

module.exports = function(nodeId, propName, value) {
  return { type: UPDATE_PROP, nodeId, propName, value };
};
