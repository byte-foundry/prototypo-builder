import {DELETE_PROPS_META} from './../const';

module.exports = function(nodeId, propName) {
  return { type: DELETE_PROPS_META, nodeId, propNames: [propName] };
};
