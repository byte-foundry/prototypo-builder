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
  SET_CONTOUR_SELECTED
} from '../actions/const';
/* Define your initial state here.
 *
 * If you change the type from object to something else, do not forget to update
 * src/container/App.js accordingly.
 */
const initialState = {
  uiState: NO_PATH_SELECTED,
  selected: {},
  hovered: {}
};

module.exports = function(state = initialState, action) {
  /* Keep the reducer clean - do not mutate the original state. */
  //let nextState = Object.assign({}, state);

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
    default: {
      /* Return original state if no actions were consumed. */
      return state;
    }
  }
}
