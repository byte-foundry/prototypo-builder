import {ADD_FONT} from './../const';

module.exports = function(nodeId, childId) {
  return { type: ADD_FONT, nodeId, childId, childType: 'font' };
};
