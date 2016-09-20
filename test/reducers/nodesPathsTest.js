import deepFreeze from 'deep-freeze';

import reducer from '~/reducers/nodes';
// import createCurve from '../../src/actions/paths/createCurve';
import actions from '~/actions';
const {
  addCurve,
} = actions;

describe('reducer: nodes (curves)', () => {
  it('should handle ADD_CURVE action', () => {
    const stateBefore = {
      'node-0': {
        id: 'node-0',
        type: 'glyph',
        childIds: [],
      },
      'node-1': {
        id: 'node-1',
        type: 'offcurve',
        childIds: [],
      },
      'node-2': {
        id: 'node-2',
        type: 'offcurve',
        childIds: [],
      },
      'node-3': {
        id: 'node-3',
        type: 'oncurve',
        childIds: [],
      },
    };
    const action = addCurve('node-0', ['node-1', 'node-2', 'node-3']);
    const stateAfter = {
      'node-0': {
        id: 'node-0',
        type: 'glyph',
        childIds: ['node-1', 'node-2', 'node-3'],
      },
      'node-1': {
        id: 'node-1',
        type: 'offcurve',
        childIds: [],
      },
      'node-2': {
        id: 'node-2',
        type: 'offcurve',
        childIds: [],
      },
      'node-3': {
        id: 'node-3',
        type: 'oncurve',
        childIds: [],
      },
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(reducer(stateBefore, action)).to.deep.equal(stateAfter);
  });
});
