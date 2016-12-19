import {CREATE_GLYPH} from './../const';
import {getNodeId} from './../_utils';

export default function() {
  const nodeType = 'glyph';
  return {
    type: CREATE_GLYPH,
    nodeId: getNodeId(nodeType),
    nodeType,
  };
}
