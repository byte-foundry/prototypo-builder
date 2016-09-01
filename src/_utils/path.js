export function mapCurve(nodeId, nodes, callback, dontMap) {
  const { childIds, isClosed } = nodes[nodeId];
  const length = ( childIds.length -1 ) / 3;
  const result = [];
  let curr;

  for ( let i = 0 ; i < childIds.length-1 ; i+=3 ) {
    if (isClosed && i + 3 === childIds.length - 1) {
      //we want to return the first node instead of the last here
      curr = callback(
        nodes[childIds[i]],
        nodes[childIds[i+1]],
        nodes[childIds[i+2]],
        nodes[childIds[0]],
        i / 3,
        length
      );
    }
    else {
      curr = callback(
        nodes[childIds[i]],
        nodes[childIds[i+1]],
        nodes[childIds[i+2]],
        nodes[childIds[i+3]],
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
        isClosed ? nodes[childIds[0]] : nodes[childIds[i]],
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

export function getCorrespondingHandles(nodeId, childId, nodes) {
  const { childIds } = nodes[nodeId];
  const i = childIds.indexOf(childId);

  const oncurveId = i%3 === 1 ? i - 1 : i + 1;

  const [onC, offC1, offC2] = getNode(nodeId, childIds[oncurveId], nodes);
  return [
    offC1,
    offC2,
    onC,
  ];
}

export function getPreviousNode(nodeId, childId, nodes) {
  const currentPos = nodes[nodeId].childIds.indexOf(childId);

  if (currentPos === 0) {
    return [undefined, undefined, undefined];
  }

  const newPos = currentPos - 3;

  return getNode(nodeId, nodes[nodeId].childIds[newPos], nodes);
}

export function getNextNode(nodeId, childId, nodes) {
  const currentPos = nodes[nodeId].childIds.indexOf(childId);

  if (currentPos === nodes[nodeId].childIds.length - 2 ) {
    return [undefined, undefined, undefined];
  }

  const newPos = currentPos + 3;

  return getNode(nodeId, nodes[nodeId].childIds[newPos], nodes);
}

export function getNode(nodeId, childId, nodes) {
  const { childIds, isClosed } = nodes[nodeId];
  const i = childIds.indexOf(childId);

  if (i !== -1 && i%3 === 0) {
    if ( childIds.length === 1 ) {
      return [
        nodes[childIds[i]],
        null,
        null,
      ];
    }
    else if ( i === 0 ) {
      //We must see if this is correct
      if (isClosed) {
        return [
          nodes[childIds[i]],
          isClosed ? nodes[childIds[childIds.length - 2]] : null,
          nodes[childIds[i + 1]],
          isClosed ? nodes[childIds[childIds.length - 1]] : null,
        ];
      }
      else {
        return [
          nodes[childIds[i]],
          isClosed ? nodes[childIds[childIds.length - 2]] : null,
          nodes[childIds[i + 1]],
        ];
      }
    }
    else if ( i === childIds.length - 1 ) {
      return [
        isClosed ? nodes[childIds[0]] : nodes[childIds[i]],
        nodes[childIds[i - 1]],
        isClosed ? nodes[childIds[1]] : null,
      ];
    }
    else {
      return [
        nodes[childIds[i]],
        nodes[childIds[i - 1]],
        nodes[childIds[i + 1]],
      ];
    }
  }
  throw new Error();
}
