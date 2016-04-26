export default function(nodeId, state, callback) {
  const { childIds } = state[nodeId];

  for ( let i = 0 ; i < childIds.length-1 ; i+=3 ) {
    callback(
      state[childIds[i]],
      state[childIds[i+1]],
      state[childIds[i+2]],
      state[childIds[i+3]],
      i / 3
    );
  }
}
