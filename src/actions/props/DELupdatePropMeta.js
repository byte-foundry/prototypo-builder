import {UPDATE_PROP_META} from './../const';

module.exports = function(nodeId, propName, meta) {
  return { type: UPDATE_PROP_META, nodeId, propNames: [propName], meta };
};
