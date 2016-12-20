import { createStore } from 'redux';
import reducers from '../reducers';

import { BATCH_ACTIONS } from '../actions/const';

// enable action batching, by Dan Abramov,
// see https://github.com/reactjs/redux/issues/911#issuecomment-149192251
function enableBatching(reducer) {
  return function batchingReducer(state, action) {
    switch (action.type) {
    case BATCH_ACTIONS:
      return action.actions.reduce(batchingReducer, state);
    default:
      return reducer(state, action);
    }
  };
}

export default function(initialState) {
  const store = createStore(
    enableBatching(reducers),
    initialState,
    typeof window === 'object' && 'devToolsExtension' in window ?
      window.devToolsExtension() :
      undefined
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');

      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
