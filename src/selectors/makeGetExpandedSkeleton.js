import { createSelectorCreator } from 'reselect';

import * as Parametric from '~/_utils/Parametric';
import nodesReducer from '~/reducers/nodes';
import * as actions from '~/actions';

// This returns the list of all oncurves and offcurves in the path
export function getNodes( state ) {
  return state.nodes;
}

export function getPathId( state, props ) {
  return props.id;
}

export function childrenEqualityCheck(parentId, currentNodes, previousNodes) {
  return currentNodes[parentId].childIds.every((value, index) => {
    return currentNodes[currentNodes[parentId].childIds[index]] === previousNodes[previousNodes[parentId].childIds[index]];
  });
}

// the 2nd and 3rd parameters helps with testing
export function memoizeNodeAndChildren(func, lastNodes = null, lastResultMap = {}) {
  return (nodes, nodeId) => {
    if (
      lastNodes === null ||
      // the node itself hasn't changed
      lastNodes[nodeId] !== nodes[nodeId] ||
      // the children nodes haven't changed
      !childrenEqualityCheck(nodeId, nodes, lastNodes)
    ) {
      lastResultMap[nodeId] = func(nodes, nodeId);
    }

    return lastResultMap[nodeId];
  };
}

// This selector makes sure the children of the node haven't ben modified either
export const createNodeAndChildrenSelector = createSelectorCreator(
  memoizeNodeAndChildren
);

export function makeGetExpandedSkeleton(expanded) {
  // We try to keep our state 'normalized': all info that CAN be calculated from
  // other parts of the state MUST NOT be stored in the state. This is the case
  // for expanded node. So we will only store them in a virtual graph
  // (`expanded`), not in the state.
  const virtualActions = {};
  Object.keys(actions).forEach((actionName) => {
    virtualActions[actionName] = (...args) => {
      const action = actions[actionName]( ...args );
      expanded.nodes = nodesReducer( expanded.nodes, action );
      return action;
    };
  });

  return createNodeAndChildrenSelector(
    [ getNodes, getPathId ],
    (nodes, pathId) => {
      return Parametric.expandPath(nodes, pathId, virtualActions, expanded);
    }
  );
}
