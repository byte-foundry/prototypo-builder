// This action creator shouldn't be used directly.
// use deleteNode instead
import {DELETE_NODE} from './../const';

module.exports = function(nodeId) {
  return { type: DELETE_NODE, nodeId };
};
