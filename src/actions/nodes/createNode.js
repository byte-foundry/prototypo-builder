import {CREATE_NODE} from './../const';
import {getNodeId} from './../_utils';

export default function createNode(nodeType = 'node') {

  return {
    type: CREATE_NODE,
    nodeId: getNodeId(nodeType),
    nodeType,
  };
}
