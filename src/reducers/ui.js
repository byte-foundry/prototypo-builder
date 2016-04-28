import {
  SET_COORDS,
  SET_MOUSE_STATE,
  MOUSE_STATE_CREATE,
  SET_NODE_SELECTED
} from '../actions/const';
/* Define your initial state here.
 *
 * If you change the type from object to something else, do not forget to update
 * src/container/App.js accordingly.
 */
const initialState = {
  uiState: MOUSE_STATE_CREATE,
  selected: {}
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
        return { ...state, selected: { point: action.point, parent: action.parent } };
    }
    /*
    case 'YOUR_ACTION': {
      // Modify next state depending on the action and return it
      return nextState;
    } break;
    */
    default: {
      /* Return original state if no actions were consumed. */
      return state;
    }
  }
}
