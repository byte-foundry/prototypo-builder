import {CREATE_CONTOUR} from './../const';
import {getNodeId} from './../_utils';

module.exports = function() {
  const nodeType = 'contour';
  return {
    type: CREATE_CONTOUR,
    nodeId: getNodeId(nodeType),
    nodeType
  };
};
