import {SET_CONTOUR_SELECTED} from './../const';

export default function(contourId) {
  return { type: SET_CONTOUR_SELECTED, contourId };
}
