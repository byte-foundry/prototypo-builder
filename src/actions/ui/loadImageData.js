import {LOAD_IMAGE_DATA} from './../const';

module.exports = function(image) {
  return { type: LOAD_IMAGE_DATA, image };
};
