import {ADD_CURVE} from './../const';

export default function(nodeId, childIds) {
  return {
    type: ADD_CURVE,
    nodeId,
    childIds,
    childTypes: ['offcurve', 'oncurve'],
  };
}
