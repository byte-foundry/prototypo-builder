import deepFreeze from 'deep-freeze';

import reducer from '~/reducers/ui';
import actions from '~/actions';

const {
  updateTmpFormula,
  deleteTmpFormula,
} = actions;

describe('reducer: ui', () => {
  it('should handle UPDATE_TMP_FORMULA action', (done) => {
    const stateBefore = {};
    const action1 = updateTmpFormula('node_0.x', '2 * 3');
    const stateAfter1 = {
      tmpFormula: { name: 'node_0.x', value: '2 * 3' },
    };

    deepFreeze(stateBefore);
    deepFreeze(action1);

    expect(reducer(stateBefore, action1)).to.deep.equal(stateAfter1);

    done();
  });

  it('should hanlde DELETE_TMP_FORMULA action', (done) => {
    const stateBefore = {
      tmpFormula: { name: 'node_0.x', value: '2 * 3' },
    };
    const action1 = deleteTmpFormula();
    const stateAfter1 = {}

    deepFreeze(stateBefore);
    deepFreeze(action1);

    expect(reducer(stateBefore, action1)).to.deep.equal(stateAfter1);

    done();
  });
});
