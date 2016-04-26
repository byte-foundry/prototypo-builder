export default function(nodeId, state, callback) {
  const { childIds, isClosed } = state[nodeId];

  for ( let i = 0; i < childIds.length ; i+=3 ) {
    if ( childIds.length === 1 ) {
      callback(
        state[childIds[i]],
        null,
        null,
        i / 3
      );
    }
    else if ( i === 0 ) {
      callback(
        state[childIds[i]],
        isClosed ? state[childIds[childIds.length-2]] : null,
        state[childIds[i+1]],
        i / 3
      );
    }
    else if ( i === childIds.length-1 ) {
      callback(
        state[childIds[i]],
        state[childIds[i-1]],
        isClosed ? state[childIds[1]] : null,
        i / 3
      );
    }
    else {
      callback(
        state[childIds[i]],
        state[childIds[i-1]],
        state[childIds[i+1]],
        i / 3
      );
    }
  }
}
