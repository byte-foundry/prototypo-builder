const deepFreeze = require('deep-freeze');

const reducer = require('../../src/reducers/nodes');
const createNode = require('../../src/actions/nodes/createNode');
const deleteNode = require('../../src/actions/nodes/deleteNode');
const addChild = require('../../src/actions/nodes/addChild');
const removeChild = require('../../src/actions/nodes/removeChild');

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

  // describe('CREATE_NODE', () => {
  //   it('should create a node with given id, type and empty childIds list', (done) => {
  //
  //     const state = Object.freeze({});
  //     let nextState = reducer(state, {
  //       type: 'CREATE_NODE',
  //       args: { nodeId: 'xyz', nodeType: 'abc' }
  //     });
  //
  //     expect(nextState.childIds).to.be.an.instanceOf(Array);
  //     expect(nextState.childIds).to.be.empty;
  //     expect(nextState.id).to.deep.equal('xyz');
  //     expect(nextState.type).to.deep.equal('abc');
  //
  //     done();
  //   });
  // });
  //
  // describe('ADD_CHILD', () => {
  //   it('should add the childId to the list of childIds', (done) => {
  //
  //     const state = Object.freeze({ childIds: [34] });
  //     let nextState = reducer(state, {
  //       type: 'ADD_CHILD',
  //       nodeId: 12,
  //       childId: 56
  //     });
  //
  //     expect(nextState.childIds).to.have.length(2);
  //     expect(nextState.childIds[1]).to.deep.equal(56);
  //
  //     done();
  //   });
  // });
  //
  // describe('REMOVE_CHILD', () => {
  //   it('should add the childId to the list of childIds', (done) => {
  //
  //     const state = Object.freeze({ childIds: [34, 56, 78] });
  //     let nextState = reducer(state, {
  //       type: 'REMOVE_CHILD',
  //       nodeId: 12,
  //       childId: 56
  //
  //     });
  //     expect(nextState.childIds).to.have.length(2);
  //     expect(nextState.childIds[1]).to.deep.equal(78);
  //
  //     done();
  //   });
  // });
});
