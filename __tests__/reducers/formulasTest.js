import deepFreeze from 'deep-freeze';

import reducer from '~/reducers/formulas';
import actions from '~/actions';
const {
  updateFormula,
  deleteFormula,
} = actions;

describe('reducer: formulas', () => {
  it('should handle UPDATE_FORMULA action', (done) => {
    const stateBefore = {};
    const action1 = updateFormula('glyph_0', 'node_1.x', '34');
    const stateAfter1 = {
      'glyph_0': {
        'node_1.x': '34',
      },
    };
    const action2 = updateFormula('glyph_1', 'node_2.expand', '$thickness');
    const stateAfter2 = {
      'glyph_0': {
        'node_1.x': '34',
      },
      'glyph_1': {
        'node_2.expand': '$thickness',
      },
    };
    const action3 = updateFormula('glyph_0', 'node_1.y', '56');
    const stateAfter3 = {
      'glyph_0': {
        'node_1.x': '34',
        'node_1.y': '56',
      },
      'glyph_1': {
        'node_2.expand': '$thickness',
      },
    };
    const action4 = updateFormula('glyph_0', 'node_1.x', '');
    const stateAfter4 = {
      'glyph_0': {
        'node_1.y': '56',
      },
      'glyph_1': {
        'node_2.expand': '$thickness',
      },
    };

    deepFreeze(stateBefore);
    deepFreeze(action1);

    expect(reducer(stateBefore, action1)).toEqual(stateAfter1);

    deepFreeze(stateAfter1);
    deepFreeze(action2);

    expect(reducer(stateAfter1, action2)).toEqual(stateAfter2);

    deepFreeze(stateAfter2);
    deepFreeze(action3);

    expect(reducer(stateAfter2, action3)).toEqual(stateAfter3);

    deepFreeze(stateAfter3);
    deepFreeze(action4);

    expect(reducer(stateAfter3, action4)).toEqual(stateAfter4);

    done();
  });

  describe('DELETE_FORMULA', () => {
    it('should handle DELETE_FORMULA with path argument', (done) => {
      const stateBefore = {
        'glyph_0': {
          'node_1.x': '34',
          'node_1.y': '56',
        },
        'glyph_1': {
          'node_2.expand': '$thickness',
        },
      };
      const action1 = deleteFormula('glyph_0', 'node_1.y');
      const stateAfter1 = {
        'glyph_0': {
          'node_1.x': '34',
        },
        'glyph_1': {
          'node_2.expand': '$thickness',
        },
      };

      deepFreeze(stateBefore);
      deepFreeze(action1);

      expect(reducer(stateBefore, action1)).toEqual(stateAfter1);

      done();
    });

    it('should handle DELETE_FORMULA to delete all formulas of a glyph', (done) => {
      const stateBefore = {
        'glyph_0': {
          'node_1.x': '34',
          'node_1.y': '56',
        },
        'glyph_1': {
          'node_2.expand': '$thickness',
        },
      };
      const action1 = deleteFormula('glyph_0');
      const stateAfter1 = {
        'glyph_1': {
          'node_2.expand': '$thickness',
        },
      };

      deepFreeze(stateBefore);
      deepFreeze(action1);

      expect(reducer(stateBefore, action1)).toEqual(stateAfter1);

      done();
    });

    it('should handle DELETE_FORMULA to delete all formulas of a node', (done) => {
      const stateBefore = {
        'glyph_0': {
          'node_1.x': '34',
          'node_1.y': '56',
          'node_0.angle': '78',
        },
        'glyph_1': {
          'node_2.expand': '$thickness',
        },
      };
      const action1 = deleteFormula('node_1');
      const stateAfter1 = {
        'glyph_0': {
          'node_0.angle': '78',
        },
        'glyph_1': {
          'node_2.expand': '$thickness',
        },
      };

      deepFreeze(stateBefore);
      deepFreeze(action1);

      expect(reducer(stateBefore, action1)).toEqual(stateAfter1);

      done();
    });
  });
});
