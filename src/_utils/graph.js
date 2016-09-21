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

export function getParentId(nodes, nodeId) {
  for (let id in nodes) {
    if ( 'childIds' in nodes[id] && nodes[id].childIds.includes(nodeId) ) {
      return id;
    }
  }

  return null;
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
  parentCache[nodeId] = getParentId(nodes, nodeId);

  return parentCache[nodeId];
}

export const getNodePath = memoize((nodes, nodeId) => {
  const path = [];
  let currId = nodeId;

  while ( currId !== 'root' ) {
    path.unshift(currId = getParentIdMemoized(nodes, currId));
  }

  return path;
});

// TODO: ideally, methods in this file shouldn't be related to the font graph
export const getParentGlyphId = memoize((nodes, nodeId) => {
  let currId = nodeId;

  while ( currId !== 'root' && nodes[currId].type !== 'glyph' ) {
    currId = getParentIdMemoized(nodes, currId);
  }

  return currId !== 'root' && currId;
});

// return all node ids in a path between startId and endId (included)
export const getSegmentIds = memoize((nodes, startId, endId) => {
  const parentId = getParentIdMemoized(nodes, startId);
  const siblingIds = nodes[parentId].childIds;

  return _getSegmentIds(siblingIds, startId, endId);
});

// This 'private' getSegmentIds provides a finer and more efficient level of cache
export const _getSegmentIds = memoize((siblingIds, startId, endId) => {
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
