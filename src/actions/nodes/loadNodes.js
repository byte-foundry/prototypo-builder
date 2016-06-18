import {LOAD_NODES} from './../const';

module.exports = function(nodes, formulas) {
  return { type: LOAD_NODES, nodes, formulas };
};
