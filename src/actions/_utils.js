export function getNodeId(prefix) {
  return `${prefix}-${getNodeId.nextId++}`;
}

getNodeId.nextId = 0;
