import Memoize from '~/_utils/Memoize';
import nodesReducer from '~/reducers/nodes';

// Returns a nodeId-indexed map of all descendants of a node
export function getDescendants(nodes, parentId, descendants = {}) {
  return getDescendantsMonomorphic(nodes, parentId, descendants);
}
// It's much more efficient to memoize a monomorphic version of the function
const getDescendantsMonomorphic = Memoize((nodes, parentId, descendants) => {
  return nodes[parentId].childIds.reduce((acc, childId) => {
    acc[childId] = nodes[childId];

    // Save a few function calls when reaching leaves
    return nodes[childId].childIds.length ?
      getDescendantsMonomorphic(nodes, childId, descendants) :
      acc;
  }, descendants);
});

// Returns the subgraph of a parent node:
// a list of node containing the parent node itself + all of its descendants
// (I'm not sure this function will ever be useful though)
// export function getSubgraph(nodes, parentId, subgraph = [ nodes[parentId] ]) {
//   return getSubgraphMonomorphic(nodes, parentId, subgraph);
// }
// // It's much more efficient to memoize a monomorphic version of the function
// const getSubgraphMonomorphic = Memoize((nodes, parentId, subgraph ) => {
//   return nodes[parentId].childIds.reduce((acc, childId) => {
//     acc.push(nodes[childId]);
//
//     // Save a few function calls when reaching leaves
//     return nodes[childId].childIds.length ?
//       getSubgraphMonomorphic(nodes, childId, subgraph) :
//       null;
//   }, subgraph);
// });

// Returns the parentId of a node
// in most cases, getParentIdMemoized should be used instead of this function
export function _getParentId(nodes, nodeId) {
  for (let id in nodes) {
    if ( 'childIds' in nodes[id] && nodes[id].childIds.includes(nodeId) ) {
      return id;
    }
  }

  return null;
}

// Use this function if you want graph-related actions to affect a virtual state
export function rewireActionCreators(state, actions) {
  const virtualActions = {};
  Object.keys(actions).forEach((actionName) => {
    virtualActions[actionName] = (...args) => {
      const action = actions[actionName]( ...args );
      state.nodes = nodesReducer( state.nodes, action );
      return action;
    };
  });

  return virtualActions;
}

// a special kind of memoization that checks that the result of the function
// still holds true, even if the 'nodes' argument has changed
const _parentCache = {};
export function getParentIdMemoized(nodes, nodeId, parentCache = _parentCache) {
  // check if the cached parent is still valid
  if (
    nodeId in parentCache &&
    parentCache[nodeId] in nodes &&
    nodes[parentCache[nodeId]].childIds.includes(nodeId)
  ) {
    return parentCache[nodeId];
  }

  // if not, search for it anew
  parentCache[nodeId] = _getParentId(nodes, nodeId);

  return parentCache[nodeId];
}

// Extract the type of a node from its Id
// This function used to be polymorphic and accept a node, but that was pointless
// since type is stored in node.nodeType
export function getNodeType( nodeId ) {
  return nodeId.split('_')[0];
}

export const getNodePath = Memoize((nodes, nodeId) => {
  const path = [];
  let currId = nodeId;

  while ( currId !== 'root' ) {
    path.unshift(currId = getParentIdMemoized(nodes, currId));
  }

  return path;
});

// TODO: ideally, methods in this file shouldn't be related to the font graph
export const getParentGlyphId = Memoize((nodes, nodeId) => {
  let currId = nodeId;

  while ( currId !== 'root' && nodes[currId].type !== 'glyph' ) {
    currId = getParentIdMemoized(nodes, currId);
  }

  return currId !== 'root' && currId;
});

// return all node ids in a path between startId and endId (included)
export const getSegmentIds = Memoize((nodes, startId, endId) => {
  const parentId = getParentIdMemoized(nodes, startId);
  const siblingIds = nodes[parentId].childIds;

  return _getSegmentIds(siblingIds, startId, endId);
});

// This 'private' getSegmentIds provides a finer and more efficient level of cache
export const _getSegmentIds = Memoize((siblingIds, startId, endId) => {
  const startIndex = siblingIds.indexOf(startId);
  const endIndex = siblingIds.indexOf(endId);

  if ( startIndex === -1 ) {
    throw Error(`Node '${startId}' is not a sibling of node '${endId}'`);
  }
  if ( endIndex === -1 ) {
    throw Error(`Node '${endId}' is not a child of node '${startId}'`);
  }

  const ids = [];
  if ( startIndex < endIndex ) {
    for ( let i = startIndex; i <= endIndex; i++ ) {
      ids.push(siblingIds[i]);
    }
  }
  else {
    for ( let i = startIndex; i >= endIndex; i-- ) {
      ids.push(siblingIds[i]);
    }
  }

  return ids;
});
