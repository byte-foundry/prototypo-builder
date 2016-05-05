import {SET_CONTOUR_SELECTED} from './../const';

module.exports = function(contourId) {
  return { type: SET_CONTOUR_SELECTED, contourId };
};
