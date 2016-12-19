import {ADD_ONCURVE} from './../const';

export default function(nodeId, childId) {
  return { type: ADD_ONCURVE, nodeId, childId, childType: 'oncurve' };
}
