import {CREATE_FONT} from './../const';
import {getNodeId} from './../_utils';

module.exports = function() {
  const nodeType = 'font';
  return {
    type: CREATE_FONT,
    nodeId: getNodeId(nodeType),
    nodeType
  };
};
