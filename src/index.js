import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './stores';
import App from './containers/App';

const store = configureStore({
  nodes: {
    'root': {
      id: 'root',
      type: 'root',
      childIds: ['font-0']
    },
    'font-0': {
      id: 'font-0',
      type: 'font',
      childIds: ['glyph-0']
    },
    'glyph-0': {
      id: 'glyph-0',
      type: 'glyph',
      childIds: ['path-0']
    },
    'path-0': {
      id: 'path-0',
      type: 'path',
      childIds: []
    }
  }
});

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
