import {CREATE_PATH} from './../const';
import {getNodeId} from './../_utils';

module.exports = function() {
  const nodeType = 'path';
  return {
    type: CREATE_PATH,
    nodeId: getNodeId(nodeType),
    nodeType
  };
};
