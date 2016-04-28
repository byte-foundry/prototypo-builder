import { createSelectorCreator } from 'reselect';
import { forEachNode } from './../_utils/pathWalkers';
import { calculatedNodes } from './../_utils/calculatedNodes';
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
    nodesReducer( _calculatedNodes, action );
    return action;
  };
  const createOncurve = (...args) => {
    const action = actionCreators.createOncurve( ...args );
    nodesReducer( _calculatedNodes, action );
    return action;
  };
  const createOffcurve = (...args) => {
    const action = actionCreators.createOffcurve( ...args );
    nodesReducer( _calculatedNodes, action );
    return action;
  };
  const addChild = (...args) => {
    const action = actionCreators.addChild( ...args );
    nodesReducer( _calculatedNodes, action );
    return action;
  };
  const updateCoords = (...args) => {
    const action = actionCreators.updateCoords( ...args );
    nodesReducer( _calculatedNodes, action );
    return action;
  };

  const expandedLeft = [];
  const expandedRight = [];
  const path = createPath();

  forEachNode(pathId, nodes, (node, cIn, cOut, i) => {
    let leftCoords = {
      x: node.x - 10,
      y: node.y - 10
    };
    let rightCoords = {
      x: node.x + 10,
      y: node.y + 10
    };
    let oncurve;
    let offcurve;
    let id;

    if ( i === 0 ) {
      oncurve = createOncurve();
      id = oncurve.id;
      expandedRight.push( id );
      updateCoords( id, leftCoords );
    }

    // if ( cIn ) {
    offcurve = createOffcurve();
    id = offcurve.id;
    if ( i === 0 ) {
      expandedRight.push( id );
    } else {
      expandedLeft.push( id );
    }
    updateCoords( id, leftCoords );

    offcurve = createOffcurve();
    id = offcurve.id;
    expandedRight.push( id );
    updateCoords( id, rightCoords );
    // }

    oncurve = createOncurve();
    id = oncurve.id;
    expandedLeft.push( id );
    updateCoords( id, leftCoords );

    oncurve = createOncurve();
    id = oncurve.id;
    expandedRight.push( id );
    updateCoords( id, rightCoords );

    // if ( cOut ) {
    offcurve = createOffcurve();
    id = offcurve.id;
    expandedLeft.push( id );
    updateCoords( id, leftCoords );

    offcurve = createOffcurve();
    id = offcurve.id;
    expandedRight.push( id );
    updateCoords( id, rightCoords );
    // }
  });

  expandedLeft.concat(expandedRight.reverse())
    .forEach((point) => {
      addChild(path.id, point.id, path.type);
    });
console.log(path);
  return path;
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
