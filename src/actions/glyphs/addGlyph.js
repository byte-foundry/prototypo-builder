import {ADD_GLYPH} from './../const';

export default function(nodeId, childId) {
  return { type: ADD_GLYPH, nodeId, childId, childType: 'glyph' };
}
