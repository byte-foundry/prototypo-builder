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

export function getNodePath(nodes, nodeId, path = ['root'], length = 1) {
  for ( let childId of nodes[path[length - 1]].childIds ) {
    if ( childId === nodeId ) {
      return path;
    }
    else {
      const tmp = getNodePath(nodes, nodeId, path.concat(childId), length + 1);
      if ( tmp ) {
        return tmp;
      }
    }
  }

  return false;
}

// a special kind of memoization that checks that the result of the function
// still holds true
const _pathCache = {};
export const getNodePathMemoized = (nodes, nodeId, pathCache = _pathCache) => {
  let cachedPath = pathCache[nodeId];
  // check if the cached path is still valid
  if ( cachedPath && !cachedPath.every((nodeId, i) => {
    return nodes[nodeId].childIds.includes(pathCache[i+1] || nodeId)
  }) ) {
    cachedPath = false;
  }

  if ( !cachedPath ) {
    cachedPath = pathCache[nodeId] = getNodePath(nodes, nodeId);
  }

  return cachedPath;
};

export function getParentGlyphId(nodes, nodeId) {
  const path = getNodePathMemoized(nodes, nodeId);

  // the id of the parent glyph should always be at the 3rd position in the path
  return path[2];
}
