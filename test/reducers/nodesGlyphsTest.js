import deepFreeze from 'deep-freeze';

import reducer from '../../src/reducers/nodes';
import createGlyph from '../../src/actions/glyphs/createGlyph';
import addGlyph from '../../src/actions/glyphs/addGlyph';

describe('reducer: nodes (glyphs)', () => {
  it('should handle CREATE_GLYPH action', () => {
    const stateBefore = {};
    const action = createGlyph();
    const stateAfter = {
      [action.nodeId]: {
        id: action.nodeId,
        type: 'glyph',
        childIds: [],
        params: {},
        paramsMeta: { _order: [] }
      }
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(reducer(stateBefore, action)).to.deep.equal(stateAfter);
  });

  it('should handle ADD_GLYPH action', () => {
    const stateBefore = {
      'node-0': {
        id: 'node-0',
        type: 'font',
        childIds: []
      },
      'node-1': {
        id: 'node-1',
        type: 'glyph',
        childIds: []
      }
    };
    const action = addGlyph('node-0', 'node-1');
    const stateAfter = {
      'node-0': {
        id: 'node-0',
        type: 'font',
        childIds: [ 'node-1' ]
      },
      'node-1': {
        id: 'node-1',
        type: 'glyph',
        childIds: []
      }
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(reducer(stateBefore, action)).to.deep.equal(stateAfter);
  });
});
