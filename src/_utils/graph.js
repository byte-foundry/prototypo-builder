import memoize from './memoize';

export const getAllDescendants = memoize((nodes, parentId, descendants) => {
  if ( !descendants ) {
    descendants = {};
  }

  return nodes[parentId].childIds.reduce((acc, childId) => {
    acc[childId] = nodes[childId];
    return getAllDescendants(nodes, childId, descendants);
  }, descendants);
});

export function getParentNode(nodes, nodeId) {
  for (let id in nodes) {
    if ( 'childIds' in nodes[id] && nodes[id].childIds.includes(nodeId) ) {
      return id;
    }
  }
}

// a special kind of memoization that checks that the result of the function
// still holds true, even if the 'nodes' argument has changed
const _parentCache = {};
export function getParentNodeMemoized(nodes, nodeId, parentCache = _parentCache) {
  // check if the cached parent is still valid
  if (
    nodeId in parentCache &&
    nodes[parentCache[nodeId]].childIds.includes(nodeId)
  ) {
    return parentCache[nodeId];
  }

  // if not, search for it anew
  parentCache[nodeId] = getParentNode(nodes, nodeId);

  return parentCache[nodeId];
}

export const getNodePath = memoize((nodes, nodeId) => {
  const path = [];
  let currId = nodeId;

  while ( currId !== 'root' ) {
    path.unshift(currId = getParentNodeMemoized(nodes, currId));
  }

  return path;
});

// // a special kind of memoization that checks that the result of the function
// // still holds true
// const _pathCache = {};
// export const getNodePathMemoized = (nodes, nodeId, pathCache = _pathCache) => {
//   let cachedPath = pathCache[nodeId];
//   // check if the cached path is still valid
//   if ( cachedPath && !cachedPath.every((nodeId, i) => {
//     return nodes[nodeId].childIds.includes(pathCache[i+1] || nodeId)
//   }) ) {
//     cachedPath = false;
//   }
//
//   if ( !cachedPath ) {
//     cachedPath = pathCache[nodeId] = getNodePath(nodes, nodeId);
//   }
//
//   return cachedPath;
// };

export const getParentGlyphId = memoize((nodes, nodeId) => {
  let currId = nodeId;

  while ( currId !== 'root' && nodes[currId].type !== 'glyph' ) {
    currId = getParentNodeMemoized(nodes, currId);
  }

  return currId !== 'root' && currId;
});
