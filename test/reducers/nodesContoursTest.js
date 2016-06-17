import deepFreeze from 'deep-freeze';

import reducer from '~/reducers/nodes';
import actions from '~/actions';
const {
  createContour,
  addContour
} = actions;

describe('reducer: nodes (contours)', () => {
  it('should handle CREATE_CONTOUR action', () => {
    const stateBefore = {};
    const action = createContour();
    const stateAfter = {
      [action.nodeId]: {
        id: action.nodeId,
        type: 'contour',
        childIds: []
      }
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(reducer(stateBefore, action)).to.deep.equal(stateAfter);
  });

  it('should handle ADD_CONTOUR action', () => {
    const stateBefore = {
      'node-0': {
        id: 'node-0',
        type: 'glyph',
        childIds: []
      },
      'node-1': {
        id: 'node-1',
        type: 'contour',
        childIds: []
      }
    };
    const action = addContour('node-0', 'node-1');
    const stateAfter = {
      'node-0': {
        id: 'node-0',
        type: 'glyph',
        childIds: [ 'node-1' ]
      },
      'node-1': {
        id: 'node-1',
        type: 'contour',
        childIds: []
      }
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(reducer(stateBefore, action)).to.deep.equal(stateAfter);
  });
});
