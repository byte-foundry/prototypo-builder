// This action creator shouldn't be used directly.
// use deleteNode instead
import {DELETE_NODE} from './../const';

export default function(nodeId) {
  return { type: DELETE_NODE, nodeId };
}
