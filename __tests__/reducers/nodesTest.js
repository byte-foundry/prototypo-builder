import deepFreeze from 'deep-freeze';

import reducer from '~/reducers/nodes';
import * as actions from '../../src/actions';

describe('reducer: nodes', () => {

  it('should provide the initial state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  it('should handle CREATE_NODE action', () => {
    const stateBefore = {};
    const action = actions.createNode('abc');
    const stateAfter = {
      [action.nodeId]: {
        id: action.nodeId,
        type: 'abc',
        childIds: [],
      },
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should handle DELETE_NODE action', () => {
    const stateBefore = {
      'node-0': {
        id: 'node-0',
        childIds: [ 'node-1' ],
      },
      'node-1': {
        id: 'node-1',
        childIds: [],
      },
      'node-2': {
        id: 'node-2',
        childIds: [ 'node-3', 'node-4' ],
      },
      'node-3': {
        id: 'node-3',
        childIds: [],
      },
      'node-4': {
        id: 'node-4',
        childIds: [],
      },
    };
    const action = actions._deleteNode('node-2');
    const stateAfter = {
      'node-0': {
        id: 'node-0',
        childIds: [ 'node-1' ],
      },
      'node-1': {
        id: 'node-1',
        childIds: [],
      },
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should handle ADD_CHILD action', () => {
    const stateBefore = {
      'node-0': {
        id: 'node-0',
        childIds: [],
      },
      'node-1': {
        id: 'node-1',
        childIds: [],
      },
    };
    const action = actions.addChild('node-0', 'node-1');
    const stateAfter = {
      'node-0': {
        id: 'node-0',
        childIds: [ 'node-1' ],
      },
      'node-1': {
        id: 'node-1',
        childIds: [],
      },
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should handle REMOVE_CHILD action', () => {
    const stateBefore = {
      'node-0': {
        id: 'node-0',
        childIds: [ 'node-1' ],
      },
      'node-1': {
        id: 'node-1',
        childIds: [],
      },
    };
    const action = actions.removeChild('node-0', 'node-1');
    const stateAfter = {
      'node-0': {
        id: 'node-0',
        childIds: [],
      },
      'node-1': {
        id: 'node-1',
        childIds: [],
      },
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });
});
