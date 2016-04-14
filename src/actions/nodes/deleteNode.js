import {DELETE_NODE} from './../const';

module.exports = function(nodeId) {
  return { type: DELETE_NODE, nodeId };
};
