import {BATCH_ACTIONS} from './../const';
import {
  createOffcurve,
  createOncurve
} from './../all';

module.exports = function() {
  return {
    type: BATCH_ACTIONS,
    actions: [
      createOffcurve(),
      createOffcurve(),
      createOncurve()
    ]
  };
};
