import {CREATE_GLYPH} from './../const';
import {getNodeId} from './../_utils';

module.exports = function() {
  const nodeType = 'glyph';
  return {
    type: CREATE_GLYPH,
    nodeId: getNodeId(nodeType),
    nodeType
  };
};
