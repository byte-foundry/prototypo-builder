import { BATCH_ACTIONS } from '~/actions/const';
import { _deleteNode, deleteFormula } from '~/actions';


export default function(nodeId) {
  return {
    type: BATCH_ACTIONS,
    actions: [
      _deleteNode(nodeId),
      deleteFormula(nodeId),
    ],
  };
}
