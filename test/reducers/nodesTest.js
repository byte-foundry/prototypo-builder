import deepFreeze from 'deep-freeze';

import reducer from '../../src/reducers/nodes';
import createNode from '../../src/actions/nodes/createNode';
import deleteNode from '../../src/actions/nodes/deleteNode';
import addChild from '../../src/actions/nodes/addChild';
import removeChild from '../../src/actions/nodes/removeChild';

describe('reducer: nodes', () => {

  it('should provide the initial state', () => {
    expect(reducer(undefined, {})).to.deep.equal({});
  });

  it('should handle CREATE_NODE action', () => {
    const stateBefore = {};
    const action = createNode({ nodeType: 'abc' });
    const stateAfter = {
      [action.nodeId]: {
        id: action.nodeId,
        type: 'abc',
        childIds: []
      }
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(reducer(stateBefore, action)).to.deep.equal(stateAfter);
  });

  it('should handle DELETE_NODE action', () => {
    const stateBefore = {
      'node-0': {
        id: 'node-0',
        childIds: [ 'node-1' ]
      },
      'node-1': {
        id: 'node-1',
        childIds: []
      },
      'node-2': {
        id: 'node-2',
        childIds: [ 'node-3', 'node-4' ]
      },
      'node-3': {
        id: 'node-3',
        childIds: []
      },
      'node-4': {
        id: 'node-4',
        childIds: []
      }
    };
    const action = deleteNode('node-2');
    const stateAfter = {
      'node-0': {
        id: 'node-0',
        childIds: [ 'node-1' ]
      },
      'node-1': {
        id: 'node-1',
        childIds: []
      }
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(reducer(stateBefore, action)).to.deep.equal(stateAfter);
  })

  it('should handle ADD_CHILD action', () => {
    const stateBefore = {
      'node-0': {
        id: 'node-0',
        childIds: []
      },
      'node-1': {
        id: 'node-1',
        childIds: []
      }
    };
    const action = addChild('node-0', 'node-1');
    const stateAfter = {
      'node-0': {
        id: 'node-0',
        childIds: [ 'node-1' ]
      },
      'node-1': {
        id: 'node-1',
        childIds: []
      }
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(reducer(stateBefore, action)).to.deep.equal(stateAfter);
  });

  it('should handle REMOVE_CHILD action', () => {
    const stateBefore = {
      'node-0': {
        id: 'node-0',
        childIds: [ 'node-1' ]
      },
      'node-1': {
        id: 'node-1',
        childIds: []
      }
    };
    const action = removeChild('node-0', 'node-1');
    const stateAfter = {
      'node-0': {
        id: 'node-0',
        childIds: []
      },
      'node-1': {
        id: 'node-1',
        childIds: []
      }
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(reducer(stateBefore, action)).to.deep.equal(stateAfter);
  });
});