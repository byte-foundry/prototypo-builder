import {CREATE_ONCURVE} from './../const';
import {getNodeId} from './../_utils';

module.exports = function() {
  const nodeType = 'oncurve';
  return {
    type: CREATE_ONCURVE,
    nodeId: getNodeId(nodeType),
    nodeType
  };
};
