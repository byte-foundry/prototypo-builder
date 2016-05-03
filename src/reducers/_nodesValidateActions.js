import fontModel from './../_utils/fontModel';

// Validate that the property we're trying to update is a known property for
// that node type
export function validateUpdateProps(state, action, model = fontModel) {
  const { nodeId, propNames } = action;
  const nodeType = state[nodeId].type;

  for ( let propName of propNames ) {
    if ( !(propName in model[nodeType].properties) ) {
      return new Error(
        `Can't update '${propName}' of '${nodeId}':
        The model doesn't allow '${propName}' for '${nodeType}'.`
      );
    }
  }

  return true;
}

export function validateAddChildren(state, action, model = fontModel) {
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


// check that the param name starts with a '$' and the it's not already a param
// of this node
export function validateAddParam(state, action) {
  const { nodeId, name } = action;

  if ( !/^\$/.test(name) ) {
    return new Error(
      `Can't add param '${name}' to node '${nodeId}':
      That name doesn't start with a '$'.`
    );
  }

  if (
    state[nodeId].params &&
    state[nodeId].params.some((param) => param.name === name)
  ) {
    return new Error(
      `Can't add param '${name}' to node '${nodeId}':
      A param with the same name already exists for that node.`
    );
  }

  return true;
}
