import {CREATE_PATH} from './../const';
import {getNodeId} from './../_utils';

export default function() {
  const nodeType = 'path';
  return {
    type: CREATE_PATH,
    nodeId: getNodeId(nodeType),
    nodeType,
  };
}
