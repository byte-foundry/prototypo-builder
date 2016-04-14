import {CREATE_NODE} from './../const';

let nextId = 0;
module.exports = function(args = {}) {
  return {
    type: CREATE_NODE,
    nodeId: `node-${nextId++}`,
    args
  };
};
