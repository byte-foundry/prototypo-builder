import R from 'ramda';

const initialState = {};

import {
  UPDATE_FORMULA,
  DELETE_FORMULA
} from './../actions/const';

module.exports = function(state = initialState, action) {
  switch(action.type) {
    case UPDATE_FORMULA:
      return action.formula.trim() === '' ? {
        ...state,
        [action.glyphId]: R.dissoc(action.propPath, state[action.glyphId])
      }: {
        ...state,
        [action.glyphId]: {
          ...state[action.glyphId],
          [action.propPath]: action.formula
        }
      };

    case DELETE_FORMULA:
      if ( action.nodeId in state ) {
        if ( action.propPath ) {
          // delete a specific formula in a specific glyph
          return {
            ...state,
            [action.nodeId]: R.dissoc(action.propPath, state[action.nodeId])
          };
        }

        // without propPath, delete the glyph entirely
        return R.dissoc(action.nodeId, state);
      }

      // delete all formulas whose path starts with this nodeId, no matter where
      // they are (slowest reducer)
      else if ( !action.propPath ) {
        let foundMatchingProp = false;
        const rInNode = new RegExp(`^${action.nodeId}(\.|$)`);

        for ( let glyphId in state ) {
          const filteredFormulas = {};
          for ( let path in state[glyphId] ) {
            if ( rInNode.test(path) ) {
              foundMatchingProp = true;
            }
            else {
              filteredFormulas[path] = state[glyphId][path];
            }
          }

          // stop looping through glyphs as soon as we found matching props
          if ( foundMatchingProp ) {
            return {
              ...state,
              [glyphId]: filteredFormulas
            }
          }
        }
      }

      return state;

    default:
      return state;
  }

}
