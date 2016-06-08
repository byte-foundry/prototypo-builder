import deepFreeze from 'deep-freeze';

import reducer from '../../src/reducers/formulas';
import {
  updateFormula,
  deleteFormula
} from 'actions/all';

describe('reducer: formulas', () => {
  it('should handle UPDATE_FORMULA action', (done) => {
    const stateBefore = {};
    const action1 = updateFormula('glyph_0', 'node_1.x', '34');
    const stateAfter1 = {
      'glyph_0': {
        'node_1.x': '34'
      }
    };
    const action2 = updateFormula('glyph_1', 'node_2.expand', '$thickness');
    const stateAfter2 = {
      'glyph_0': {
        'node_1.x': '34'
      },
      'glyph_1': {
        'node_2.expand': '$thickness'
      }
    };
    const action3 = updateFormula('glyph_0', 'node_1.y', '56');
    const stateAfter3 = {
      'glyph_0': {
        'node_1.x': '34',
        'node_1.y': '56'
      },
      'glyph_1': {
        'node_2.expand': '$thickness'
      }
    };

    deepFreeze(stateBefore);
    deepFreeze(action1);

    expect(reducer(stateBefore, action1)).to.deep.equal(stateAfter1);

    deepFreeze(stateAfter1);
    deepFreeze(action2);

    expect(reducer(stateAfter1, action2)).to.deep.equal(stateAfter2);

    deepFreeze(stateAfter2);
    deepFreeze(action3);

    expect(reducer(stateAfter2, action3)).to.deep.equal(stateAfter3);

    done();
  });

  it('should handle DELETE_FORMULA action', (done) => {
    const stateBefore = {
      'glyph_0': {
        'node_1.x': '34',
        'node_1.y': '56'
      },
      'glyph_1': {
        'node_2.expand': '$thickness'
      }
    };
    const action1 = deleteFormula('glyph_0', 'node_1.y');
    const stateAfter1 = {
      'glyph_0': {
        'node_1.x': '34'
      },
      'glyph_1': {
        'node_2.expand': '$thickness'
      }
    };

    deepFreeze(stateBefore);
    deepFreeze(action1);

    expect(reducer(stateBefore, action1)).to.deep.equal(stateAfter1);

    done();
  });
});
