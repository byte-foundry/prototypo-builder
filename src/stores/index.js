import { createStore } from 'redux';
import reducers from '../reducers';

export default function(initialState) {
  const store = createStore(
    reducers,
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
