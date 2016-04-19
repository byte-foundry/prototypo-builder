import {CREATE_NODE} from './../const';

function createNode(args = {}) {
  const prefix = args.nodeType || 'node';

  return {
    type: CREATE_NODE,
    nodeId: `${prefix}-${createNode.nextId++}`,
    args
  };
}

createNode.nextId = 0;

module.exports = createNode;
