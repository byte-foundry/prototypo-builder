import {BATCH_ACTIONS} from './../const';
import {
  createOffcurve,
  createOncurve,
} from '~/actions';

export default function() {
  return {
    type: BATCH_ACTIONS,
    actions: [
      createOffcurve(),
      createOffcurve(),
      createOncurve(),
    ],
  };
}
