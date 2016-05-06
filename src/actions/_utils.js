export function getNodeId(prefix) {
  return `${prefix}_${getNodeId.nextId++}`;
}

getNodeId.nextId = 0;
