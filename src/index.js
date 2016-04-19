import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './stores';
import App from './containers/App';

// We'll use -00 suffix for ids to make sure we avoid collisions with
// auto-generated ids
const store = configureStore({
  nodes: {
    'root': {
      id: 'root',
      type: 'root',
      childIds: ['font-00']
    },
    'font-00': {
      id: 'font-00',
      type: 'font',
      childIds: ['glyph-00']
    },
    'glyph-00': {
      id: 'glyph-00',
      type: 'glyph',
      childIds: ['contour-00']
    },
    'contour-00': {
      id: 'contour-00',
      type: 'contour',
      childIds: ['path-00']
    },
    'path-00': {
      id: 'path-00',
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
