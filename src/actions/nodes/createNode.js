import {CREATE_NODE} from './../const';

function createNode(args = {}) {
  return {
    type: CREATE_NODE,
    nodeId: `node-${createNode.nextId++}`,
    args
  };
}

createNode.nextId = 0;

module.exports = createNode;
