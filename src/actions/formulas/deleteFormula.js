import {DELETE_FORMULA} from './../const';

module.exports = function(nodeId, propPath) {
  return { type: DELETE_FORMULA, nodeId, propPath };
};
