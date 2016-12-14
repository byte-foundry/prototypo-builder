import R from 'ramda';

import {
  LOAD_IMAGE_DATA,
  SET_COORDS,
  SET_MOUSE_STATE,
  SET_PATH_SELECTED,
  NO_PATH_SELECTED,
  SET_NODE_SELECTED,
  SET_NODE_HOVERED,
  SET_NODE_OPTIONS_SELECTED,
  SET_PATH_HOVERED,
  SET_CONTOUR_SELECTED,
  UPDATE_TMP_FORMULA,
  DELETE_TMP_FORMULA,
  SET_CONTOUR_MODE,
  SET_INTERPOLATED_TANGENTS_MODE,
  SET_ACTIVE_TAB,
  SET_BASE_EXPAND,
} from '../actions/const';

import {
  DEFAULT_EXPAND,
} from '~/const';

const initialState = {
  uiState: NO_PATH_SELECTED,
  selected: {},
  hovered: {},
  contourMode: 'catmull',
  showInterpolatedTangents: false,
  activeTab: {type: 'all', glyph: undefined},
  baseExpand: DEFAULT_EXPAND,
};

module.exports = function(state = initialState, action) {
  switch(action.type) {
    case SET_COORDS: {
      return { ...state, mouse: { ...state.mouse, x: action.x, y: action.y } };
    }
    case SET_MOUSE_STATE: {
      return { ...state, uiState: action.state};
    }
    case SET_NODE_SELECTED: {
      return { ...state, selected: { ...state.selected, point: action.point, parent: action.parent } };
    }
    case SET_NODE_OPTIONS_SELECTED: {
      return { ...state, selected: { ...state.selected, nodeOptions: action.node } };
    }
    case SET_NODE_HOVERED: {
      return { ...state, hovered: { ...state.hovered, point: action.point, parent: action.parent } };
    }
    case SET_PATH_SELECTED: {
      return { ...state, selected: { ...state.selected, path: action.path, pathParent: action.parent } };
    }
    case SET_PATH_HOVERED: {
      return { ...state, hovered: { ...state.hovered, path: action.path, pathParent: action.parent } };
    }
    case SET_CONTOUR_SELECTED: {
      return { ...state, selected: { ...state.selected, contour: action.contourId} };
    }
    case LOAD_IMAGE_DATA: {
      return { ...state, image: action.image};
    }
    case UPDATE_TMP_FORMULA: {
      return {
        ...state,
        tmpFormula: { name: action.name, value: action.value },
      };
    }
    case DELETE_TMP_FORMULA: {
      return R.dissoc('tmpFormula', state);
    }
    case SET_CONTOUR_MODE: {
      return {
        ...state,
        contourMode: (action.mode === 'simple' ? 'simple' : 'catmull'),
      }
    }
    case SET_INTERPOLATED_TANGENTS_MODE: {
      return {
        ...state,
        showInterpolatedTangents: action.mode,
      }
    }
    case SET_ACTIVE_TAB: {
      return {
        ...state,
        activeTab: {type: action.tab.type, glyph: action.tab.glyph},
      }
    }
    case SET_BASE_EXPAND: {
      return {
        ...state,
        baseExpand: action.value,
      }
    }
    default: {
      return state;
    }
  }
}
