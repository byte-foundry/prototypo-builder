const config = require('config');

import logError from './../_utils/logError';

import {
  ADD_CHILD,
  REMOVE_CHILD,
  CREATE_NODE,
  DELETE_NODE,

  CREATE_FONT,
  ADD_FONT,

  CREATE_GLYPH,
  ADD_GLYPH,

  CREATE_CONTOUR,
  ADD_CONTOUR,

  CREATE_PATH,
  ADD_PATH,

  CREATE_ONCURVE,
  ADD_ONCURVE,

  CREATE_OFFCURVE,
  ADD_OFFCURVE,

  UPDATE_X,
  UPDATE_Y
} from './../actions/const';

import {
  validateAction,
  validateAdd,
  validateUpdate,
  validateGraph
} from './_nodesValidateActions';

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
    case CREATE_CONTOUR:
    case CREATE_PATH:
    case CREATE_ONCURVE:
    case CREATE_OFFCURVE:
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
    case ADD_GLYPH:
    case ADD_CONTOUR:
    case ADD_PATH:
    case ADD_ONCURVE:
    case ADD_OFFCURVE:
      return Object.assign({}, state, {
        childIds: childIds(state.childIds, action)
      });

    case UPDATE_X:
      return Object.assign({}, state, {
        x: action.value
      });
    case UPDATE_Y:
      return Object.assign({}, state, {
        y: action.value
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

export default function(state = {}, action) {
  const { type, nodeId } = action;

  if ( typeof type === 'undefined' || typeof nodeId === 'undefined' ) {
    return state;
  }

  // During dev, we're verifying that the UI prevents impossible actions
  // such as adding a font to a glyph or updating the coordinates of a non-point
  if (  config.appEnv === 'dev' ) {
    logError( validateAction(state, action) );

    if ( /^ADD_/.test(type) && type !== ADD_GLYPH ) {
      logError( validateAdd(state, action) );
      logError( validateGraph(state, action) );
    }

    if ( /^UPDATE_/.test(type) ) {
      logError( validateUpdate(state, action) );
    }
  }

  if ( type === DELETE_NODE ) {
    const descendantIds = getAllDescendantIds(state, nodeId);
    return deleteMany(state, [ nodeId, ...descendantIds ]);
  }

  const nodes = Object.assign({}, state, {
    [nodeId]: node( state[nodeId], action )
  });



  return nodes;
}
