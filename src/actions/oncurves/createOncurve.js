import {getNodeId} from '~/actions/_utils';
import { CREATE_ONCURVE } from '~/actions/const';
import { ONCURVE_SMOOTH } from '~/const';

module.exports = function() {
  const nodeType = 'oncurve';
  return {
    type: CREATE_ONCURVE,
    nodeId: getNodeId(nodeType),
    nodeType,
    props: {
      state: ONCURVE_SMOOTH
    }
  };
};
