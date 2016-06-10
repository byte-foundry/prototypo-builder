import deepFreeze from 'deep-freeze';

import reducer from '~/reducers/nodes';
import actions from '~/actions';
const {
  addParam,
  deleteParam,
  updateParam
  // updateParamMeta
  // updateParamValue
} = actions;

describe('reducer: nodes (node params)', () => {
  it('should handle ADD_PARAM action', (done) => {
    const stateBefore = {
      'node-0': {
        id: 'node-0'
      }
    };
    const action1 = addParam('node-0', 'height', { a: 12 });
    const stateAfter1 = {
      'node-0': {
        id: 'node-0',
        params: {
          height: { a: 12 }
        }
      }
    };
    const action2 = addParam('node-0', 'width', {
      value: 56, b: 34, formula: '2 * 3'
    });
    const stateAfter2 = {
      'node-0': {
        id: 'node-0',
        params: {
          height: { a: 12 },
          width: { value: 56, b: 34, formula: '2 * 3' }
        }
      }
    };

    deepFreeze(stateBefore);
    deepFreeze(action1);

    expect(reducer(stateBefore, action1)).to.deep.equal(stateAfter1);

    deepFreeze(stateAfter1);
    deepFreeze(action2);

    expect(reducer(stateAfter1, action2)).to.deep.equal(stateAfter2);

    done();
  });

  it('should handle DELETE_PARAM action', (done) => {
    const stateBefore = {
      'node-0': {
        id: 'node-0',
        params: {
          height: { a: 12 },
          width: { value: 56, b: 34, formula: '2 * 3' }
        }
      }
    };
    const action = deleteParam('node-0', 'height');
    const stateAfter = {
      'node-0': {
        id: 'node-0',
        params: {
          width: { value: 56, b: 34, formula: '2 * 3' }
        }
      }
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(reducer(stateBefore, action)).to.deep.equal(stateAfter);

    done();
  });

  it('should handle UPDATE_PARAM action', (done) => {
    const stateBefore = {
      'node-0': {
        id: 'node-0',
        params: {
          height: { a: 12 },
          width: { value: 56, b: 34, formula: '2 * 3' }
        }
      }
    };
    const action1 = updateParam('node-0', 'height', { value: 78 });
    const stateAfter1 = {
      'node-0': {
        id: 'node-0',
        params: {
          height: { a: 12, value: 78 },
          width: { value: 56, b: 34, formula: '2 * 3' }
        }
      }
    };
    const action2 = updateParam('node-0', 'width', { value: 90 });
    const stateAfter2 = {
      'node-0': {
        id: 'node-0',
        params: {
          height: { a: 12, value: 78 },
          width: { value: 90, b: 34, formula: '2 * 3' }
        }
      }
    };

    deepFreeze(stateBefore);
    deepFreeze(action1);

    expect(reducer(stateBefore, action1)).to.deep.equal(stateAfter1);

    deepFreeze(stateAfter1);
    deepFreeze(action2);

    expect(reducer(stateAfter1, action2)).to.deep.equal(stateAfter2);

    done();
  });

  // it('should handle UPDATE_PARAM_META action and ignore any updater', (done) => {
  //   const stateBefore = {
  //     'node-0': {
  //       id: 'node-0',
  //       params: {
  //         height: 78,
  //         width: 56
  //       },
  //       paramsMeta: {
  //         _order: ['height', 'width'],
  //         height: { a: 12 },
  //         width: { b: 34 }
  //       }
  //     }
  //   };
  //   const action = updateParamMeta('node-0', 'height', { min: 90, updater: Math.min });
  //   const stateAfter = {
  //     'node-0': {
  //       id: 'node-0',
  //       params: {
  //         height: 78,
  //         width: 56
  //       },
  //       paramsMeta: {
  //         _order: ['height', 'width'],
  //         height: { a: 12, min: 90 },
  //         width: { b: 34 }
  //       }
  //     }
  //   };
  //
  //   deepFreeze(stateBefore);
  //   deepFreeze(action);
  //
  //   expect(reducer(stateBefore, action)).to.deep.equal(stateAfter);
  //
  //   done();
  // });

  // it('should handle UPDATE_PARAM_VALUE action', (done) => {
  //   const stateBefore = {
  //     'node-0': {
  //       id: 'node-0',
  //       params: [{
  //         name: 'height',
  //         value: 12
  //       }, {
  //         name: 'width',
  //         value: 34
  //       }]
  //     }
  //   };
  //   const action = updateParamValue('node-0', 'height', 56);
  //   const stateAfter = {
  //     'node-0': {
  //       id: 'node-0',
  //       params: [{
  //         name: 'height',
  //         value: 56
  //       }, {
  //         name: 'width',
  //         value: 34
  //       }]
  //     }
  //   };
  //
  //   deepFreeze(stateBefore);
  //   deepFreeze(action);
  //
  //   expect(reducer(stateBefore, action)).to.deep.equal(stateAfter);
  //
  //   done();
  // });
});
