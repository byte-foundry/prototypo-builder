import deepFreeze from 'deep-freeze';

import reducer from '../../src/reducers/nodes';
import {
  updateProp,
  updateProps,
  updatePropMeta,
  // updatePropValue,
  // updatePropsValues,
  updateCoords
} from 'actions/all';

describe('reducer: nodes (node props)', () => {
  it('should handle UPDATE_PROP action', (done) => {
    const stateBefore = {
      'node-0': {
        id: 'node-0',
        type: 'offcurve',
        childIds: []
      }
    };
    const action1 = updateProp('node-0', 'x', 123);
    const stateAfter1 = {
      'node-0': {
        id: 'node-0',
        type: 'offcurve',
        childIds: [],
        x: 123
      }
    };
    const action2 = updateProp('node-0', 'x', 456);
    const stateAfter2 = {
      'node-0': {
        id: 'node-0',
        type: 'offcurve',
        childIds: [],
        x: 456
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

  it('should handle UPDATE_PROPS action', (done) => {
    const stateBefore = {
      'node-0': {
        id: 'node-0',
        type: 'oncurve',
        childIds: []
      }
    };
    const action1 = updateProps('node-0', { x: 98, expand: 76 });
    const stateAfter1 = {
      'node-0': {
        id: 'node-0',
        type: 'oncurve',
        childIds: [],
        x: 98,
        expand: 76
      }
    };
    const action2 = updateProps('node-0', { x: 12, expand: 34 });
    const stateAfter2 = {
      'node-0': {
        id: 'node-0',
        type: 'oncurve',
        childIds: [],
        x: 12,
        expand: 34
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

  it('should handle UPDATE_PROP_META action', (done) => {
    const stateBefore = {
      'node-0': {
        id: 'node-0'
      }
    };
    const action1 = updatePropMeta('node-0', 'width', { min: 12 });
    const stateAfter1 = {
      'node-0': {
        id: 'node-0',
        widthMeta: { min: 12 }
      }
    };
    const action2 = updatePropMeta('node-0', 'width', { max: 34 });
    const stateAfter2 = {
      'node-0': {
        id: 'node-0',
        widthMeta: { min: 12, max: 34 }
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

  // it('should handle UPDATE_PROP_VALUE action', (done) => {
  //   const stateBefore = {
  //     'node-0': {
  //       id: 'node-0',
  //       type: 'offcurve',
  //       childIds: []
  //     }
  //   };
  //   const action = updatePropValue('node-0', 'x', 123);
  //   const stateAfter = {
  //     'node-0': {
  //       id: 'node-0',
  //       type: 'offcurve',
  //       childIds: [],
  //       x: { value: 123 }
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
  //
  // it('should handle UPDATE_PROPS_VALUES action', (done) => {
  //   const stateBefore = {
  //     'node-0': {
  //       id: 'node-0',
  //       type: 'oncurve',
  //       childIds: [],
  //       x: { value: 12, min: 34 },
  //       expand: { value: 56, max: 78 }
  //     }
  //   };
  //   const action = updatePropsValues('node-0', { x: 90, expand: 12 });
  //   const stateAfter = {
  //     'node-0': {
  //       id: 'node-0',
  //       type: 'oncurve',
  //       childIds: [],
  //       x: { value: 90, min: 34 },
  //       expand: { value: 12, max: 78 }
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

  it('should handle UPDATE_COORDS action', (done) => {
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

    done();
  });
});
