import {getNodeId} from '~/actions/_utils';
import { CREATE_ONCURVE } from '~/actions/const';
import { ONCURVE_SMOOTH, DEFAULT_DISTRIB, DEFAULT_ANGLE, DEFAULT_EXPAND } from '~/const';

module.exports = function() {
  const nodeType = 'oncurve';
  return {
    type: CREATE_ONCURVE,
    nodeId: getNodeId(nodeType),
    nodeType,
    props: {
      state: ONCURVE_SMOOTH,
      distrib: DEFAULT_DISTRIB,
      expand: DEFAULT_EXPAND,
      angle: DEFAULT_ANGLE,
    },
  };
};
