/* Combine all available reducers to a single root reducer.
 *
 * CAUTION: When using the generators, this file is modified in some places.
 *          This is done via AST traversal - Some of your formatting may be lost
 *          in the process - no functionality should be broken though.
 *          This modifications only run once when the generator is invoked - if
 *          you edit them, they are not updated again.
 */
import { combineReducers } from 'redux';
import nodeReducer from './nodes';
import uiReducer from './ui';
import updatersReducer from './updaters';
/* Populated by react-webpack-redux:reducer */
const reducers = {
  nodes: nodeReducer,
  ui: uiReducer,
  // combineReducers will complain without this
  updaters: (state = {}) => state
};
const combinedReducers = combineReducers(reducers);

module.exports = function(state = {}, action) {
  let hasChanged = false;

  const newState = combinedReducers(state, action);
  if ( newState !== state ) {
    hasChanged = true;
  }

  // Our updaters updatersReducer needs to read the graph, which isn't
  // compatible with redux's combineReducers philosophy. So we treat it separately.
  // We intentionnaly apply the updatersReducer to 'state', not 'newState', as
  // combinedReducers aren't supposed to touch that part of the state
  const newUpdaters = updatersReducer(state.updaters, action, state.nodes);
  if ( newUpdaters !== state.updaters ) {
    hasChanged = true;
  }

  return hasChanged ?
    { ...newState, updaters: newUpdaters } :
    state;
};

// module.exports = combineReducers(reducers);
