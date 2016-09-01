import R from 'ramda';

/* Define your initial state here.
 *
 * If you change the type from object to something else, do not forget to update
 * src/container/App.js accordingly.
 */
const initialState = {};

import {
  getParentGlyphId,
} from './../_utils/graph';

import {
  ADD_PARAM,
  DELETE_PARAM,
  UPDATE_PARAM_META,
  UPDATE_PROP_META,
} from './../actions/const';

// TODO: each glyph/font in this part of the state should be like:
// 'glyph_id': { params: ..., props: ... }
module.exports = function(state = initialState, action, nodes = {}) {
  if (
    action.type !== DELETE_PARAM &&
    ( !('meta' in action) || !('updater' in action.meta) )
  ) {
    return state;
  }

  switch(action.type) {
    case ADD_PARAM:
      return {
        ...state,
        [action.nodeId]: {
          ...state[action.nodeId],
          [action.name]: {
            updater: action.meta.updater,
            params: action.meta.params,
            refs: action.meta.refs,
          },
        },
      };

    case DELETE_PARAM:
      return {
        ...state,
        [action.nodeId]: R.dissoc(action.name, state[action.nodeId]),
      };

    case UPDATE_PARAM_META:
      return {
        ...state,
        [action.nodeId]: ( action.meta.formula !== '' ?
          {
            ...state[action.nodeId],
            [action.name]: {
              updater: action.meta.updater,
              params: action.meta.params,
              refs: action.meta.refs,
            },
          } :
          R.dissoc(action.name, state[action.nodeId])
        ),
      };

    case UPDATE_PROP_META:
      const glyphId = getParentGlyphId(nodes, action.nodeId);
      const propPath = action.nodeId + '.' + action.propNames[0];

      return {
        ...state,
        [glyphId]: (
          action.meta.formula !== '' ?
            {
              ...state[glyphId],
              [action.nodeId + '.' + action.propNames[0]]: {
                updater: action.meta.updater,
                params: action.meta.params,
                refs: action.meta.refs,
              },
            } :
            R.dissoc(propPath, state[glyphId])
          ),
      };

    default: {
      return state;
    }
  }
}
