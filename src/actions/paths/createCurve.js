import {CREATE_CURVE} from './../const';
import {getNodeId} from './../_utils';

module.exports = function() {
  return {
    type: CREATE_CURVE,
    nodes: [
      getNodeId('offcurve'),
      getNodeId('offcurve'),
      getNodeId('oncurve')
    ]
  };
};
