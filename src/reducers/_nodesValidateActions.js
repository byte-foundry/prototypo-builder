import fontModel from './../_utils/fontModel';

// Validate that the property we're trying to update is a known property for
// that node type
export function validateUpdate(state, action, model = fontModel) {
  const { nodeId, propName } = action;
  const nodeType = state[nodeId].type;

  if ( !(propName in model[nodeType].properties) ) {
    return new Error(
      `Can't update '${propName}' of '${nodeId}':
      The model doesn't allow '${propName}' for '${nodeType}'.`
    );
  }

  return true;
}

export function validateAdd(state, action, model = fontModel) {
  const { nodeId } = action;
  const childIds = action.childIds || [action.childId];
  const parentType = state[nodeId].type;

  for ( let childId of childIds ) {
    const childType = state[childId].type;
    if ( !(childType in model[parentType].children) ) {
      return new Error(
        `Can't make '${childId}' a child of '${nodeId}':
        The model doesn't allow a '${childType}' as a child of a '${parentType}'.`
      );
    }
  }

  return true;
}

// Check that the nodeId that is about to be added to the graph is not already
// present in a childIds
export function validateGraph(state, action) {
  const { nodeId } = action;
  const childIds = action.childIds || [action.childId];

  for ( let key in state ) {
    for ( let childId of childIds ) {
      if ( state[key].childIds.includes( childId ) ) {
        return new Error(
          `Can't make '${childId}' a child of '${nodeId}':
          '${childId}' is already a child of '${key}'.`
        );
      }
    }
  }

  return true;
}
