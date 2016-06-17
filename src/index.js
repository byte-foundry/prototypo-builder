import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './stores';
import App from './containers/App';

const store = configureStore({
  nodes: {
    // root must always be named root
    'root': {
      id: 'root',
      type: 'root',
      childIds: ['font_initial']
    },
    'font_initial': {
      id: 'font_initial',
      type: 'font',
      childIds: ['glyph_initial'],
      params: {},
      paramsMeta: { _order: [] }
    },
    'glyph_initial': {
      id: 'glyph_initial',
      type: 'glyph',
      childIds: ['contour_initial'],
      params: {},
      paramsMeta: { _order: [] }
    },
    'contour_initial': {
      id: 'contour_initial',
      type: 'contour',
      childIds: [],
      selected: true
    }
  },
  ui: {
    hovered: {},
    selected: {
      glyph: 'glyph_initial',
      contour: 'contour_initial'
    }
  },
  formulas: {}
});

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
