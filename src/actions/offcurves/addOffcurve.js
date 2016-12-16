import {ADD_OFFCURVE} from './../const';

export default function(nodeId, childId) {
  return { type: ADD_OFFCURVE, nodeId, childId, childType: 'offcurve' };
}
