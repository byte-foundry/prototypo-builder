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
      childIds: ['path-initial']
    },
    'path-initial': {
      id: 'path-initial',
      type: 'path',
      childIds: ['oncurve-initial', 'offcurve-initial']
    },
    'oncurve-initial': {
      id: 'oncurve-initial',
      type: 'oncurve',
      childIds: [],
      x: 0,
      y: 0,
      state: 1
    },
    'offcurve-initial': {
      id: 'offcurve-initial',
      type: 'offcurve',
      childIds: [],
      x: 0,
      y: 0
    }
  }
});

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
