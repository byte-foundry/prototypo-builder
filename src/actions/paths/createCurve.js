import {CREATE_CURVE} from './../const';
import {getNodeId} from './../_utils';

module.exports = function() {
  return {
    type: CREATE_CURVE,
    nodeIds: [
      getNodeId('offcurve'),
      getNodeId('offcurve'),
      getNodeId('oncurve')
    ]
  };
};
