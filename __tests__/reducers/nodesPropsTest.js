import deepFreeze from 'deep-freeze';

import reducer from '~/reducers/nodes';
import * as actions from '~/actions';
const {
  updateProp,
  updateCoords,
} = actions;

describe('reducer: nodes (node props)', () => {
  it('should handle UPDATE_PROP action', (done) => {
    const stateBefore = {
      'node-0': {
        id: 'node-0',
        type: 'offcurve',
        childIds: [],
      },
    };
    const action1 = updateProp('node-0', 'x', 123);
    const stateAfter1 = {
      'node-0': {
        id: 'node-0',
        type: 'offcurve',
        childIds: [],
        x: 123,
      },
    };
    const action2 = updateProp('node-0', 'x', 456);
    const stateAfter2 = {
      'node-0': {
        id: 'node-0',
        type: 'offcurve',
        childIds: [],
        x: 456,
      },
    };

    deepFreeze(stateBefore);
    deepFreeze(action1);

    expect(reducer(stateBefore, action1)).toEqual(stateAfter1);

    deepFreeze(stateAfter1);
    deepFreeze(action2);

    expect(reducer(stateAfter1, action2)).toEqual(stateAfter2);

    done();
  });

  it('should handle UPDATE_COORDS action', (done) => {
    const stateBefore = {
      'node-0': {
        id: 'node-0',
        type: 'offcurve',
        childIds: [],
      },
    };
    const action1 = updateCoords('node-0', 12, 34);
    const stateAfter1 = {
      'node-0': {
        id: 'node-0',
        type: 'offcurve',
        childIds: [],
        x: 12,
        y: 34,
      },
    };

    deepFreeze(stateBefore);
    deepFreeze(action1);

    expect(reducer(stateBefore, action1)).toEqual(stateAfter1);

    const action2 = updateCoords('node-0', [56, 78]);
    const stateAfter2 = {
      'node-0': {
        id: 'node-0',
        type: 'offcurve',
        childIds: [],
        x: 56,
        y: 78,
      },
    };

    deepFreeze(action2);

    expect(reducer(stateBefore, action2)).toEqual(stateAfter2);

    const action3 = updateCoords('node-0', { x: 90, y: 13});
    const stateAfter3 = {
      'node-0': {
        id: 'node-0',
        type: 'offcurve',
        childIds: [],
        x: 90,
        y: 13,
      },
    };

    deepFreeze(action3);

    expect(reducer(stateBefore, action3)).toEqual(stateAfter3);

    done();
  });
});
