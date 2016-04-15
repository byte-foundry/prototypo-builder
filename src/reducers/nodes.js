import {
  ADD_CHILD,
  REMOVE_CHILD,
  CREATE_NODE,
  DELETE_NODE,

  CREATE_FONT,
  ADD_FONT,

  CREATE_GLYPH,
  ADD_GLYPH
} from './../actions/const';

/* Define your initial state here.
 *
 * If you change the type from object to something else, do not forget to update
 * src/container/App.js accordingly.
 */
const initialState = {};

function childIds(state, action) {
  switch(action.type.split('_')[0]) {
    case 'ADD':
      return [...state, action.childId ];

    case 'REMOVE':
      return state.filter(id => id !== action.childId);

    default:
      return state;
  }
}

function node(state = initialState, action) {
  const { type, nodeId } = action;

  switch(type) {
    case CREATE_NODE:
    case CREATE_FONT:
    case CREATE_GLYPH:
      return {
        id: nodeId,
        type: action.args.nodeType,
        childIds: []
      };

    case ADD_CHILD:
    case REMOVE_CHILD:
      return Object.assign({}, state, {
        childIds: childIds(state.childIds, action)
      });

    case ADD_FONT:
      // fonts can only be added to the root node
      if ( state.type !== 'root' ) {
        throw new Error(`Can't use action ${type} on parent node ${nodeId}.`);
      }
      return Object.assign({}, state, {
        childIds: childIds(state.childIds, action)
      });

    case ADD_GLYPH:
      // glyphs can only be added to a font
      if ( state.type !== 'font' ) {
        throw new Error(`Can't use action ${type} on parent node ${nodeId}.`);
      }
      return Object.assign({}, state, {
        childIds: childIds(state.childIds, action)
      });

    default:
      return state;
  }
}

function getAllDescendantIds(state, nodeId) {
  return state[nodeId].childIds.reduce((acc, childId) => (
    [ ...acc, childId, ...getAllDescendantIds(state, childId) ]
  ), []);
}

function deleteMany(state, ids) {
  state = Object.assign({}, state);
  ids.forEach(id => delete state[id]);
  return state;
}

module.exports = function(state = {}, action) {
  const { type, nodeId, childId } = action;

  if ( typeof type === 'undefined' || typeof nodeId === 'undefined' ) {
    return state;
  }

  // When a childId is specified in the action, prevent the action in
  // case the type of the child doesn't match the suffix of the action.
  // This prevents trying to addFont
  const suffix = type.split('_').pop().toLowerCase();
  if (
    typeof childId !== 'undefined' &&
    suffix !== 'child' &&
    suffix !== state[childId].type
  ) {
    throw new Error(`Can't use action ${type} on child node ${childId}.`);
  }

  if ( type === DELETE_NODE ) {
    const descendantIds = getAllDescendantIds(state, nodeId);
    return deleteMany(state, [ nodeId, ...descendantIds ]);
  }

  return Object.assign({}, state, {
    [nodeId]: node( state[nodeId], action )
  });
}
