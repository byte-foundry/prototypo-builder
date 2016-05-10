import {LOAD_NODES} from './../const';

module.exports = function(nodes, updaters) {
  return { type: LOAD_NODES, nodes, updaters };
};
