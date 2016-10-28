import {CREATE_OFFCURVE} from './../const';
import {getNodeId} from './../_utils';

module.exports = function() {
  const nodeType = 'offcurve';
  return {
    type: CREATE_OFFCURVE,
    nodeId: getNodeId(nodeType),
    nodeType,
  };
};
