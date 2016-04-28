const config = require('config');

import logError from './../_utils/logError';

import {
  ADD_CHILD,
  ADD_CHILDREN,
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

  CREATE_CURVE,
  ADD_CURVE,

  CREATE_ONCURVE,
  ADD_ONCURVE,

  CREATE_OFFCURVE,
  ADD_OFFCURVE,

  UPDATE_PROP,
  UPDATE_X,
  UPDATE_Y,
  MOVE_NODE,

  ONCURVE_SMOOTH
} from './../actions/const';

import {
  validateAdd,
  validateUpdate,
  validateGraph
} from './_nodesValidateActions';

import {
  getNode,
  getCorrespondingHandles
} from '../_utils/pathWalkers';

/* Define your initial state here.
 *
 * If you change the type from object to something else, do not forget to update
 * src/container/App.js accordingly.
 */
const initialState = {};

function createNode(action) {
  const { nodeId, nodeType, state } = action;

  return {
    id: nodeId,
    type: nodeType,
    childIds: [],
    state,
  }
}

function childIds(state, action) {
  switch(action.type.split('_')[0]) {
    case 'ADD':
      return action.childIds ?
        [...state, ...action.childIds ] :
        [...state, action.childId ];

    case 'REMOVE':
      return action.childIds ?
        state.filter((id) => !(action.childIds.includes(id))) :
        state.filter((id) => id !== action.childId);

    default:
      return state;
  }
}

function node(state = initialState, action) {
  const { type } = action;

  switch(type) {
    case CREATE_NODE:
    case CREATE_FONT:
    case CREATE_GLYPH:
    case CREATE_CONTOUR:
    case CREATE_PATH:
    case CREATE_ONCURVE:
    case CREATE_OFFCURVE:
      return createNode(action);

    case ADD_CHILD:
    case ADD_CHILDREN:
    case REMOVE_CHILD:
    case ADD_FONT:
    case ADD_GLYPH:
    case ADD_CONTOUR:
    case ADD_PATH:
    case ADD_CURVE:
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

    case UPDATE_PROP:
      return Object.assign({}, state, {
        [action.propName]: action.value
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

function deepPositionUpdate(node, nodes, x=0, y=0, result) {
  const type = node.type;

  if (type === 'oncurve' || type === 'offcurve') {
    result[node.id] = {
      ...node,
      x: node.x + x,
      y: node.y + y
    }
  } else {
    node.childIds.forEach((childId) => {
      const target = nodes[childId];
      deepPositionUpdate(target, nodes, x, y, result);
    });
  }
}

export default function(state = {}, action) {
  const { type, nodeId, parentId, nodeIds } = action;

  if (
    typeof type === 'undefined' ||
    ( typeof nodeId === 'undefined' && typeof nodeIds === 'undefined' )
  ) {
    return state;
  }

  // During dev, we're verifying that the UI prevents impossible actions
  // such as adding a font to a glyph or updating the coordinates of a non-point
  if (  config.appEnv === 'dev' ) {
    if ( /^ADD_/.test(type) && type !== ADD_GLYPH ) {
      logError( validateAdd(state, action) );
      logError( validateGraph(state, action) );
    }

    if ( /^UPDATE_/.test(type) ) {
      logError( validateUpdate(state, action) );
    }
  }

  switch (type) {
    case DELETE_NODE:
      const descendantIds = getAllDescendantIds(state, nodeId);
      return deleteMany(state, [ nodeId, ...descendantIds ]);

    case CREATE_CURVE:
      const nodes = {};
      nodeIds.forEach((nodeId, i) => {
        nodes[nodeId] = createNode({
          nodeId,
          nodeType: i === 2 ? 'oncurve' : 'offcurve'
        });
      });
      return Object.assign({}, state, nodes);

    case MOVE_NODE:
      const path = state[nodeId];
      const type = path.type;
      if ( type === 'oncurve') {
        const nodesToMove = getNode(parentId, nodeId, state);
        const resultNode = {};
        nodesToMove.forEach((node) => {
          if (node !== null) {
            node.x = (node.x || 0) + action.dx;
            node.y = (node.y || 0) + action.dy;
            resultNode[node.id] = node;
          }
        });
        return {...state, ...resultNode};
      } else if ( type === 'offcurve') {
        const nodesToMove = getCorrespondingHandles(parentId, nodeId, state);
        const result = {...state,
          [nodeId]: {...state[nodeId], x: path.x + action.dx, y: path.y + action.dy}
        };
        if (nodesToMove[2].state === ONCURVE_SMOOTH) {
          const oppositeNode = nodeId === nodesToMove[1].id ? nodesToMove[0] : nodesToMove[1];
          if (oppositeNode) {
            result[oppositeNode.id] = {...state[oppositeNode.id], x: oppositeNode.x - action.dx, y: oppositeNode.y - action.dy};
          }
        }
        return result;
      } else {
        const result = {};
        deepPositionUpdate(path, state, action.dx, action.dy, result);
        return {...state, ...result};
      }

    default:
      return Object.assign({}, state, {
        [nodeId]: node( state[nodeId], action )
      });
  }
}
