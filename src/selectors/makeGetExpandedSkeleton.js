import { createSelectorCreator } from 'reselect';
import { forEachNode } from './../_utils/pathWalkers';
import calculatedNodes from './../_utils/calculatedNodes';
import nodesReducer from './../reducers/nodes';

import {
  createPath,
  createCurve,
  createOncurve,
  createOffcurve,
  addChild,
  addCurve,
  addOncurve,
  updateCoords
} from './../actions/all';
const actionCreators = {
  createPath,
  createCurve,
  createOncurve,
  createOffcurve,
  addChild,
  addCurve,
  addOncurve,
  updateCoords
};

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
      lastNodes = nodes;
      lastResultMap[nodeId] = func(nodes, nodeId);
    }

    return lastResultMap[nodeId];
  };
}

// the last argument helps with testing
export function expandPath( nodes, pathId, _calculatedNodes = calculatedNodes ) {
  // TODO: refactor that sh*t!
  const createPath = (...args) => {
    const action = actionCreators.createPath( ...args );
    _calculatedNodes.nodes = nodesReducer( _calculatedNodes.nodes, action );
    return action;
  };
  const createOncurve = (...args) => {
    const action = actionCreators.createOncurve( ...args );
    _calculatedNodes.nodes = nodesReducer( _calculatedNodes.nodes, action );
    return action;
  };
  const createOffcurve = (...args) => {
    const action = actionCreators.createOffcurve( ...args );
    _calculatedNodes.nodes = nodesReducer( _calculatedNodes.nodes, action );
    return action;
  };
  const addChild = (...args) => {
    const action = actionCreators.addChild( ...args );
    _calculatedNodes.nodes = nodesReducer( _calculatedNodes.nodes, action );
    return action;
  };
  const updateCoords = (...args) => {
    const action = actionCreators.updateCoords( ...args );
    _calculatedNodes.nodes = nodesReducer( _calculatedNodes.nodes, action );
    return action;
  };

  const expandedLeft = [];
  const expandedRight = [];
  const expandedPathId = createPath().nodeId;

  forEachNode(pathId, nodes, (node, cIn, cOut, i) => {
    let leftCoords = {
      x: node.x - 10,
      y: node.y - 10
    };
    let rightCoords = {
      x: node.x + 10,
      y: node.y + 10
    };
    let nodeId;

    if ( i === 0 ) {
      nodeId = createOncurve().nodeId;
      expandedRight.push( nodeId );
      updateCoords( nodeId, leftCoords );
    }

    // if ( cIn ) {
    nodeId = createOffcurve().nodeId;
    if ( i === 0 ) {
      expandedRight.push( nodeId );
    } else {
      expandedLeft.push( nodeId );
    }
    updateCoords( nodeId, leftCoords );

    nodeId = createOffcurve().nodeId;
    expandedRight.push( nodeId );
    updateCoords( nodeId, rightCoords );
    // }

    nodeId = createOncurve().nodeId;
    expandedLeft.push( nodeId );
    updateCoords( nodeId, leftCoords );

    nodeId = createOncurve().nodeId;
    expandedRight.push( nodeId );
    updateCoords( nodeId, rightCoords );

    // if ( cOut ) {
    nodeId = createOffcurve().nodeId;
    expandedLeft.push( nodeId );
    updateCoords( nodeId, leftCoords );

    nodeId = createOffcurve().nodeId;
    expandedRight.push( nodeId );
    updateCoords( nodeId, rightCoords );
    // }
  });

  expandedLeft.concat(expandedRight.reverse())
    .forEach((pointId) => {
      addChild(expandedPathId, pointId, _calculatedNodes.nodes[pointId].type);
    });

  return expandedPathId;
}

// This selector makes sure the children of the node haven't ben modified either
export const createNodeAndChildrenSelector = createSelectorCreator(
  memoizeNodeAndChildren
);

export function makeGetExpandedSkeleton() {
  return createNodeAndChildrenSelector(
    [ getNodes, getPathId ],
    expandPath
  );
}
