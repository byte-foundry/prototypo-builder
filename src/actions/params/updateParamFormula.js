import {UPDATE_PARAM_FORMULA} from './../const';

module.exports = function(nodeId, name, formula) {
  return { type: UPDATE_PARAM_FORMULA, nodeId, name, formula };
};
