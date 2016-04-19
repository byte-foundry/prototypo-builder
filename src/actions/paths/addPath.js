import {ADD_PATH} from './../const';

module.exports = function(nodeId, childId) {
  return { type: ADD_PATH, nodeId, childId, childType: 'path' };
};
