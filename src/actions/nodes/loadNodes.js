import {LOAD_NODES} from './../const';

export default function(nodes, formulas) {
  return { type: LOAD_NODES, nodes, formulas };
}
