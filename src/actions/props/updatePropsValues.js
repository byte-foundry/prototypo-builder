import {UPDATE_PROPS_VALUES} from './../const';

module.exports = function(nodeId, values) {
  return { type: UPDATE_PROPS_VALUES, nodeId, propNames: Object.keys(values), values };
};
