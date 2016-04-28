import deepFreeze from 'deep-freeze';

import reducer from '../../src/reducers/nodes';
import {
  createNode,
  deleteNode,
  addChild,
  removeChild,
  updateProp,
  updateCoords,
  updateProps
} from 'actions/all';

describe('reducer: nodes', () => {

  it('should provide the initial state', () => {
    expect(reducer(undefined, {})).to.deep.equal({});
  });

  it('should handle CREATE_NODE action', () => {
    const stateBefore = {};
    const action = createNode('abc');
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

  it('should handle UPDATE_PROP action', () => {
    const stateBefore = {
      'node-0': {
        id: 'node-0',
        type: 'offcurve',
        childIds: []
      }
    };
    const action = updateProp('node-0', 'x', 123);
    const stateAfter = {
      'node-0': {
        id: 'node-0',
        type: 'offcurve',
        childIds: [],
        x: 123
      }
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(reducer(stateBefore, action)).to.deep.equal(stateAfter);
  });

  it('should handle UPDATE_COORDS action', () => {
    const stateBefore = {
      'node-0': {
        id: 'node-0',
        type: 'offcurve',
        childIds: []
      }
    };
    const action1 = updateCoords('node-0', 12, 34);
    const stateAfter1 = {
      'node-0': {
        id: 'node-0',
        type: 'offcurve',
        childIds: [],
        x: 12,
        y: 34
      }
    };

    deepFreeze(stateBefore);
    deepFreeze(action1);

    expect(reducer(stateBefore, action1)).to.deep.equal(stateAfter1);

    const action2 = updateCoords('node-0', [56, 78]);
    const stateAfter2 = {
      'node-0': {
        id: 'node-0',
        type: 'offcurve',
        childIds: [],
        x: 56,
        y: 78
      }
    };

    deepFreeze(action2);

    expect(reducer(stateBefore, action2)).to.deep.equal(stateAfter2);

    const action3 = updateCoords('node-0', { x: 90, y: 13});
    const stateAfter3 = {
      'node-0': {
        id: 'node-0',
        type: 'offcurve',
        childIds: [],
        x: 90,
        y: 13
      }
    };

    deepFreeze(action3);

    expect(reducer(stateBefore, action3)).to.deep.equal(stateAfter3);
  });

  it('should handle UPDATE_PROPS action', () => {
    const stateBefore = {
      'node-0': {
        id: 'node-0',
        type: 'oncurve',
        childIds: []
      }
    };
    const action = updateProps('node-0', { x: 98, expand: 76 });
    const stateAfter = {
      'node-0': {
        id: 'node-0',
        type: 'oncurve',
        childIds: [],
        x: 98,
        expand: 76
      }
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(reducer(stateBefore, action)).to.deep.equal(stateAfter);
  });
});
