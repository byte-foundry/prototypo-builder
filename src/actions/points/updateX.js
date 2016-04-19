import {UPDATE_X} from './../const';

module.exports = function(nodeId, value) {
  return { type: UPDATE_X, nodeId, propName: 'x', value };
};
