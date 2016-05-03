import {UPDATE_PROPS} from './../const';

module.exports = function(nodeId, props) {
  return { type: UPDATE_PROPS, nodeId, propNames: Object.keys(props), props };
};
