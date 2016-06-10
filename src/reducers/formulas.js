import R from 'ramda';

const initialState = {};

import {
  UPDATE_FORMULA,
  DELETE_FORMULA
} from './../actions/const';

module.exports = function(state = initialState, action) {
  switch(action.type) {
    case UPDATE_FORMULA:
      return action.formula.trim() === '' ? {
        ...state,
        [action.glyphId]: R.dissoc(action.propPath, state[action.glyphId])
      }: {
        ...state,
        [action.glyphId]: {
          ...state[action.glyphId],
          [action.propPath]: action.formula
        }
      };

    case DELETE_FORMULA:
      return {
        ...state,
        [action.glyphId]: R.dissoc(action.propPath, state[action.glyphId])
      };

    default:
      return state;
  }

}
