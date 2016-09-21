import { createSelectorCreator } from 'reselect';
import { forEachNode } from './../_utils/path';
import nodesReducer from './../reducers/nodes';

import {
  createPath,
  createCurve,
  createOncurve,
  createOffcurve,
  addChild,
  addCurve,
  addOncurve,
  updateCoords,
} from '~/actions';
const actionCreators = {
  createPath,
  createCurve,
  createOncurve,
  createOffcurve,
  addChild,
  addCurve,
  addOncurve,
  updateCoords,
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
      lastResultMap[nodeId] = func(nodes, nodeId);
    }

    return lastResultMap[nodeId];
  };
}

// the last argument helps with testing
export function expandPath( nodes, pathId, actions, expanded ) {
  const expandedLeft = [];
  const expandedRight = [];
  const {
    createPath,
    createOncurve,
    createOffcurve,
    addChild,
    updateCoords,
  } = actions;
  const expandedPathId = createPath().nodeId;

  forEachNode(pathId, nodes, (node, cIn, cOut, i) => {
    const angle = node.angle || 0;
    const width = node.width || 10;
    const distrib = node.distrib || 0;

    const shift = {
      x: Math.cos(angle / 360 * 2 * Math.PI) * width,
      y: Math.sin(angle / 360 * 2 * Math.PI) * width,
    }

    const leftCoords = {
      x: node.x + shift.x * (distrib - 1),
      y: node.y + shift.y * (distrib - 1),
    };
    const rightCoords = {
      x: node.x + shift.x * distrib,
      y: node.y + shift.y * distrib,
    };
    const outCurveVec = {
      x: cOut.x - node.x,
      y: cOut.y - node.y,
    };
    const inCurveVec = {
      x: cIn.x - node.x,
      y: cIn.y - node.y,
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
    }
    else {
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
      addChild(expandedPathId, pointId, expanded.nodes[pointId].type);
    });

  return expandedPathId;
}

// This selector makes sure the children of the node haven't ben modified either
export const createNodeAndChildrenSelector = createSelectorCreator(
  memoizeNodeAndChildren
);

export function makeGetExpandedSkeleton(expanded) {
  const actions = {};
  Object.keys(actionCreators).forEach((actionName) => {
    actions[actionName] = (...args) => {
      const action = actionCreators[actionName]( ...args );
      expanded.nodes = nodesReducer( expanded.nodes, action );
      return action;
    };
  });

  return createNodeAndChildrenSelector(
    [ getNodes, getPathId],
    (nodes, pathId) => {
      return expandPath(nodes, pathId, actions, expanded);
    }
  );
}
