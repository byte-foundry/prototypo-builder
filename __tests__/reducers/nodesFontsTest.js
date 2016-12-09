import deepFreeze from 'deep-freeze';

import reducer from '~/reducers/nodes';
import actions from '~/actions';
const {
  createFont,
  addFont,
} = actions;

describe('reducer: nodes (fonts)', () => {
  it('should handle CREATE_FONT action', () => {
    const stateBefore = {};
    const action = createFont();
    const stateAfter = {
      [action.nodeId]: {
        id: action.nodeId,
        type: 'font',
        childIds: [],
        params: {},
      },
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should handle ADD_FONT action', () => {
    const stateBefore = {
      'node-0': {
        id: 'node-0',
        type: 'root',
        childIds: [],
      },
      'node-1': {
        id: 'node-1',
        type: 'font',
        childIds: [],
      },
    };
    const action = addFont('node-0', 'node-1');
    const stateAfter = {
      'node-0': {
        id: 'node-0',
        type: 'root',
        childIds: [ 'node-1' ],
      },
      'node-1': {
        id: 'node-1',
        type: 'font',
        childIds: [],
      },
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });
});
