import deepFreeze from 'deep-freeze';

import reducer from '~/reducers/nodes';
import * as actions from '../../src/actions';

describe('reducer: nodes (glyphs)', () => {
  it('should handle CREATE_GLYPH action', () => {
    const stateBefore = {};
    const action = actions.createGlyph();
    const stateAfter = {
      [action.nodeId]: {
        id: action.nodeId,
        type: 'glyph',
        childIds: [],
        params: {},
      },
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should handle ADD_GLYPH action', () => {
    const stateBefore = {
      'node-0': {
        id: 'node-0',
        type: 'font',
        childIds: [],
      },
      'node-1': {
        id: 'node-1',
        type: 'glyph',
        childIds: [],
      },
    };
    const action = actions.addGlyph('node-0', 'node-1');
    const stateAfter = {
      'node-0': {
        id: 'node-0',
        type: 'font',
        childIds: [ 'node-1' ],
      },
      'node-1': {
        id: 'node-1',
        type: 'glyph',
        childIds: [],
      },
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });
});
