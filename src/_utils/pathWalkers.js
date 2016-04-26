export function mapCurve(nodeId, nodes, callback, dontMap) {
  const { childIds } = nodes[nodeId];
  const length = ( childIds.length -1 ) / 3;
  const result = [];
  let curr;

  for ( let i = 0 ; i < childIds.length-1 ; i+=3 ) {
    curr = callback(
      nodes[childIds[i]],
      nodes[childIds[i+1]],
      nodes[childIds[i+2]],
      nodes[childIds[i+3]],
      i / 3,
      length
    );

    if ( !dontMap ) {
      result.push(curr);
    }
  }

  if ( !dontMap ) {
    return result;
  }
}

export function forEachCurve() {
  mapCurve.apply(null, [...arguments, true]);
}

export function mapNode(nodeId, nodes, callback, dontMap) {
  const { childIds, isClosed } = nodes[nodeId];
  const length = Math.floor( childIds.length / 3 ) + 1;
  const result = [];
  let curr;

  for ( let i = 0; i < childIds.length ; i+=3 ) {
    if ( childIds.length === 1 ) {
      curr = callback(
        nodes[childIds[i]],
        null,
        null,
        i / 3,
        length
      );
    }
    else if ( i === 0 ) {
      curr = callback(
        nodes[childIds[i]],
        isClosed ? nodes[childIds[childIds.length-2]] : null,
        nodes[childIds[i+1]],
        i / 3,
        length
      );
    }
    else if ( i === childIds.length-1 ) {
      curr = callback(
        nodes[childIds[i]],
        nodes[childIds[i-1]],
        isClosed ? nodes[childIds[1]] : null,
        i / 3,
        length
      );
    }
    else {
      curr = callback(
        nodes[childIds[i]],
        nodes[childIds[i-1]],
        nodes[childIds[i+1]],
        i / 3,
        length
      );
    }

    if ( !dontMap ) {
      result.push(curr);
    }
  }

  if ( !dontMap ) {
    return result;
  }
}

export function forEachNode() {
  return mapNode.apply(null, [...arguments, true]);
}
