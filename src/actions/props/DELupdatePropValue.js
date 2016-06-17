import {UPDATE_PROP_VALUE} from './../const';

module.exports = function(nodeId, propName, value) {
  return { type: UPDATE_PROP_VALUE, nodeId, propNames: [propName], value };
};
