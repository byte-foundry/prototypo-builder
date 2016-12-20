import R from 'ramda';

import * as Path from '~/_utils/Path';
import * as Graph from '~/_utils/Graph.js';
import LogError from '~/_utils/LogError';
import {
  ADD_CHILD,
  ADD_CHILDREN,
  ADD_CONTOUR,
  ADD_CURVE,
  ADD_FONT,
  ADD_GLYPH,
  ADD_OFFCURVE,
  ADD_ONCURVE,
  ADD_PARAM,
  ADD_PATH,
  CREATE_CONTOUR,
  CREATE_FONT,
  CREATE_GLYPH,
  CREATE_NODE,
  CREATE_OFFCURVE,
  CREATE_ONCURVE,
  CREATE_PATH,
  DELETE_NODE,
  DELETE_PARAM,
  MOVE_NODE,
  REMOVE_CHILD,
  UPDATE_COORDS,
  UPDATE_PARAM,
  UPDATE_PROP,
  UPDATE_X,
  UPDATE_Y,
} from '~/actions/const';
import {
  ONCURVE_SMOOTH,
} from '~/const';

import {
  validateAddChildren,
  validateUpdateProps,
  validateGraph,
  validateAddParam,
} from './_nodesValidateActions';

const config = require('config').default;

/* Define your initial state here.
 *
 * If you change the type from object to something else, do not forget to update
 * src/container/App.js accordingly.
 */
const initialState = {};
const initialNode = {};

function createNode(action) {
  const { nodeId, nodeType, props } = action;

  return {
    id: nodeId,
    type: nodeType,
    childIds: [],
    ...props,
  };
}

function initParams(node) {
  return {
    ...node,
    params: {},
  };
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

function node(state = initialNode, action) {
  const { type } = action;

  switch(type) {
    case CREATE_NODE:
    case CREATE_CONTOUR:
    case CREATE_PATH:
    case CREATE_ONCURVE:
    case CREATE_OFFCURVE:
      return createNode(action);
    case CREATE_FONT:
    case CREATE_GLYPH:
      return initParams(createNode(action));

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
      return { ...state, childIds: childIds(state.childIds, action) };

    case ADD_PARAM:
      // do nothing if a param with the same name already exists
      return state.paramsMeta && action.name in state.paramsMeta ? state : {
        ...state,
        params: {
          ...state.params,
          [action.name]: action.props,
        },
      };
    case DELETE_PARAM:
      return {
        ...state,
        params: R.dissoc(action.name, state.params),
      };
    case UPDATE_PARAM:
      return {
        ...state,
        params: {
          ...state.params,
          [action.name]: {
            ...state.params[action.name],
            ...action.props,
          },
        },
      };

    case UPDATE_X:
      return { ...state, x: action.value };
    case UPDATE_Y:
      return { ...state, y: action.value };
    case UPDATE_COORDS:
      return { ...state, x: action.coords.x, y: action.coords.y };
    case UPDATE_PROP:
      return { ...state, [action.propNames[0]]: action.value };
    default:
      return state;
  }
}

function deleteMany(state, ids) {
  const nextState = Object.assign({}, state);

  ids.forEach((id) => { delete nextState[id]; });
  return nextState;
}

function deepPositionUpdate(node, nodes, x=0, y=0, result) {
  const type = node.type;

  if (type === 'oncurve' || type === 'offcurve') {
    result[node.id] = {
      ...node,
      x: node.x + x,
      y: node.y + y,
    };
  }
  else {
    node.childIds.forEach((childId) => {
      const target = nodes[childId];

      deepPositionUpdate(target, nodes, x, y, result);
    });
  }
}

export default function(state = initialState, action) {
  const { type, nodeId, parentId } = action;

  // filter-out actions that won't impact that part of the state
  // TODO: we shouldn't need to filter out actions here. This is what the
  // 'default' part of every switch is for.
  if (
    // propPath is always present in formulas actions
    'propPath' in action ||
    typeof nodeId === 'undefined'
  ) {
    return state;
  }

  // During dev, we're verifying that the UI prevents impossible actions
  // such as adding a font to a glyph or updating the coordinates of a non-point
  if ( config.appEnv === 'dev' ) {
    if ( /^ADD_/.test(type) && ( 'childId' in action || 'childIds' in action ) ) {
      LogError( validateAddChildren(state, action) );
      LogError( validateGraph(state, action) );
    }

    if ( /^UPDATE_/.test(type) && 'propNames' in action ) {
      LogError( validateUpdateProps(state, action) );
    }

    if ( /^ADD_PARAM$/.test(type) ) {
      LogError( validateAddParam(state, action) );
    }
  }

  switch (type) {
    case DELETE_NODE: {
      const descendantIds = Object.keys(Graph.getDescendants(state, nodeId));

      return deleteMany(state, [ nodeId, ...descendantIds ]);
    }
    // TODO: rename, cleanup and test this reducer (and move it elsewhere probably)
    case MOVE_NODE: {
      const path = state[nodeId];
      const type = path.type;

      if ( type === 'oncurve') {
        const nodesToMove = Path.getNode(parentId, nodeId, state);
        const resultNode = {};

        nodesToMove.forEach((node) => {
          if (node !== null) {
            const newNode = { ...node };

            newNode.x = (newNode.x || 0) + action.dx;
            newNode.y = (newNode.y || 0) + action.dy;
            if (newNode._isGhost) {
              newNode._isGhost = false;
            }
            resultNode[newNode.id] = newNode;
          }
        });

        const [, nextIn] = Path.getNextNode(parentId, nodeId, state);

        if (nextIn) {
          resultNode[nextIn.id] = { ...nextIn, _isGhost: false};
        }

        const [,, prevOut] = Path.getPrevNode(parentId, nodeId, state);

        if (prevOut) {
          resultNode[prevOut.id] = { ...prevOut, _isGhost: false};
        }
        return {...state, ...resultNode};
      }
      else if ( type === 'offcurve') {
        const nodesToMove = Path.getNode(parentId, nodeId, state);
        const result = {...state,
          [nodeId]: {...state[nodeId], x: path.x + action.dx, y: path.y + action.dy},
        };

        if (nodesToMove[0].state === ONCURVE_SMOOTH) {
          const oppositeNode =
            nodeId === nodesToMove[2].id ? nodesToMove[1] : nodesToMove[2];

          if (oppositeNode) {
            result[oppositeNode.id] = {
              ...state[oppositeNode.id],
              x: oppositeNode.x - action.dx,
              y: oppositeNode.y - action.dy,
              _isGhost: false,
            };
          }
        }
        return result;
      }
      else {
        const result = {};

        deepPositionUpdate(path, state, action.dx, action.dy, result);
        return {...state, ...result};
      }
    }
    default: {
      return R.merge(state, { [nodeId]: node( state[nodeId], action ) });
    }
  }
}
