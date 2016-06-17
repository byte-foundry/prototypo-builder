import {UPDATE_PROP_FORMULA} from './../const';

module.exports = function(nodeId, name, formula) {
  return { type: UPDATE_PROP_FORMULA, nodeId, name, formula };
};
