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
      childIds: ['font-initial']
    },
    'font-initial': {
      id: 'font-initial',
      type: 'font',
      childIds: ['glyph-initial'],
      params: {},
      paramsMeta: { _order: [] }
    },
    'glyph-initial': {
      id: 'glyph-initial',
      type: 'glyph',
      childIds: ['contour-initial'],
      params: {},
      paramsMeta: { _order: [] }
    },
    'contour-initial': {
      id: 'contour-initial',
      type: 'contour',
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
