import {UPDATE_PARAM_META} from './../const';

module.exports = function(nodeId, name, meta) {
  return { type: UPDATE_PARAM_META, nodeId, name, meta };
};
