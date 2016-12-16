import deepFreeze from 'deep-freeze';

import reducer from '~/reducers/nodes';
import * as actions from '../../src/actions';

describe('reducer: nodes (contours)', () => {
  it('should handle CREATE_CONTOUR action', () => {
    const stateBefore = {};
    const action = actions.createContour();
    const stateAfter = {
      [action.nodeId]: {
        id: action.nodeId,
        type: 'contour',
        childIds: [],
      },
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should handle ADD_CONTOUR action', () => {
    const stateBefore = {
      'node-0': {
        id: 'node-0',
        type: 'glyph',
        childIds: [],
      },
      'node-1': {
        id: 'node-1',
        type: 'contour',
        childIds: [],
      },
    };
    const action = actions.addContour('node-0', 'node-1');
    const stateAfter = {
      'node-0': {
        id: 'node-0',
        type: 'glyph',
        childIds: [ 'node-1' ],
      },
      'node-1': {
        id: 'node-1',
        type: 'contour',
        childIds: [],
      },
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });
});
