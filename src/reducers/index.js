/* Combine all available reducers to a single root reducer.
 *
 * CAUTION: When using the generators, this file is modified in some places.
 *          This is done via AST traversal - Some of your formatting may be lost
 *          in the process - no functionality should be broken though.
 *          This modifications only run once when the generator is invoked - if
 *          you edit them, they are not updated again.
 */
import { combineReducers } from 'redux';

import { LOAD_NODES } from '~/actions/const';

import nodeReducer from './nodes';
import uiReducer from './ui';
import formulaReducer from './formulas';

/* Populated by react-webpack-redux:reducer */
const reducers = {
  nodes: nodeReducer,
  ui: uiReducer,
  formulas: formulaReducer,
};
const combinedReducers = combineReducers(reducers);

export default function(state = {}, action) {
  switch ( action.type ) {
    // (temporary) special action that hydrates the complete state from a file
    case LOAD_NODES:
      return {
        ...state,
        nodes: action.nodes,
        formulas: action.formulas,
      };

    default:
      return combinedReducers(state, action);
  }
}
