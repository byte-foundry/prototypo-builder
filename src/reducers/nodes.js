import { ADD_CHILD, REMOVE_CHILD, CREATE_NODE, DELETE_NODE } from './../actions/const';

/* Define your initial state here.
 *
 * If you change the type from object to something else, do not forget to update
 * src/container/App.js accordingly.
 */
const initialState = {};

function childIds(state, action) {
  switch(action.type) {
    case ADD_CHILD:
      return [...state, action.childId ];
    case REMOVE_CHILD:
      return state.filter(id => id !== action.childId);
    default:
      return state;
  }
}

function node(state = initialState, action) {
  switch(action.type) {
    case CREATE_NODE:
      // Modify next state depending on the action and return it
      return {
        id: action.nodeId,
        type: action.args.nodeType,
        childIds: []
      };

    case ADD_CHILD:
    case REMOVE_CHILD:
      return Object.assign({}, state, {
        childIds: childIds(state.childIds, action)
      });

    default:
      // Return original state if no actions were consumed.
      return state;
  }
}

function getAllDescendantIds(state, nodeId) {
  return state[nodeId].childIds.reduce((acc, childId) => (
    [ ...acc, childId, ...getAllDescendantIds(state, childId) ]
  ), [])
}

function deleteMany(state, ids) {
  state = Object.assign({}, state);
  ids.forEach(id => delete state[id]);
  return state;
}

module.exports = function(state = {}, action) {
  const { type, nodeId } = action;
  if ( typeof nodeId === 'undefined' ) {
    return state;
  }

  if ( type === DELETE_NODE ) {
    const descendantIds = getAllDescendantIds(state, nodeId);
    return deleteMany(state, [ nodeId, ...descendantIds ]);
  }

  return Object.assign({}, state, {
    [nodeId]: node(state[nodeId], action)
  });
}
