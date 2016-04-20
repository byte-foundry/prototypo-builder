import {CREATE_NODE} from './../const';
import {getNodeId} from './../_utils';

function createNode(nodeType = 'node') {

  return {
    type: CREATE_NODE,
    nodeId: getNodeId(nodeType),
    nodeType
  };
}

module.exports = createNode;
