import R from 'ramda';

export const getAllDescendants = R.memoize((nodes, parentId, descendants = {}) => {
  return nodes[parentId].childIds.reduce((acc, childId) => {console.log(acc);
    acc[childId] = nodes[childId];
    return getAllDescendants(nodes, childId, descendants);
  }, descendants);
});
