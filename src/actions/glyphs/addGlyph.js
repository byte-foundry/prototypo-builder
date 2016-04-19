import {ADD_GLYPH} from './../const';

module.exports = function(nodeId, childId) {
  return { type: ADD_GLYPH, nodeId, childId, childType: 'glyph' };
};
