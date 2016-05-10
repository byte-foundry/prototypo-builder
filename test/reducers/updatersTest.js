import deepFreeze from 'deep-freeze';

import reducer from '../../src/reducers/updaters';
import {
  addParam,
  deleteParam,
  updateParamMeta,
  updatePropMeta
} from 'actions/all';

describe('updaters', () => {
  let graph;

  beforeEach(() => {
    graph = {
      'root': { childIds: ['font_0'] },
      'font_0': { childIds: ['glyph_0', 'glyph_1'] },
      'glyph_0': { childIds: ['node_0', 'node_1'] },
      'glyph_1': { childIds: ['node_2'] },
      'node_0': { childIds:[] },
      'node_1': { childIds:[] },
      'node_2': { childIds:[] }
    };
  });

  it('should not change the passed state', (done) => {

    const state = Object.freeze({});
    reducer(state, {type: 'INVALID'});

    done();
  });

  it('should handle ADD_PARAM action', (done) => {
    const stateBefore = {};
    const action1 = addParam('font_0', '$width', undefined, { updater: 12, formula: '12' });
    const stateAfter1 = {
      'font_0': {
        '$width': { updater: 12, params: undefined, refs: undefined }
      }
    };
    const action2 = addParam('font_0', '$height', undefined, { updater: 34, formula: '34' });
    const stateAfter2 = {
      'font_0': {
        '$width': { updater: 12, params: undefined, refs: undefined },
        '$height': { updater: 34, params: undefined, refs: undefined }
      }
    };

    deepFreeze(graph);
    deepFreeze(stateBefore);
    deepFreeze(action1);
    deepFreeze(stateAfter1);
    deepFreeze(action2);
    deepFreeze(stateAfter2);

    expect(reducer(stateBefore, action1, graph)).to.deep.equal(stateAfter1);
    expect(reducer(stateAfter1, action2, graph)).to.deep.equal(stateAfter2);

    done();
  });

  it('should handle DELETE_PARAM action', (done) => {
    const stateBefore = {
      'node_0': {
        '$width': { updater: 56, params: undefined, refs: undefined },
        '$height': { updater: 34, params: undefined, refs: undefined }
      }
    };
    const action = deleteParam('node_0', '$height');
    const stateAfter = {
      'node_0': {
        '$width': { updater: 56, params: undefined, refs: undefined }
      }
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(reducer(stateBefore, action, graph)).to.deep.equal(stateAfter);

    done();
  });

  it('should handle UPDATE_PROP_META action', (done) => {
    const stateBefore = {};
    const action1 = updatePropMeta('node_0', 'x', { updater: 12, formula: '12' });
    const stateAfter1 = {
      'glyph_0': {
        'node_0.x': { updater: 12, params: undefined, refs: undefined }
      }
    };
    const action2 = updatePropMeta('node_2', 'y', { updater: 34, formula: '34' });
    const stateAfter2 = {
      'glyph_0': {
        'node_0.x': { updater: 12, params: undefined, refs: undefined }
      },
      'glyph_1': {
        'node_2.y': { updater: 34, params: undefined, refs: undefined }
      }
    };
    const action3 = updatePropMeta('node_1', 'y', { updater: 56, formula: '56' });
    const stateAfter3 = {
      'glyph_0': {
        'node_0.x': { updater: 12, params: undefined, refs: undefined },
        'node_1.y': { updater: 56, params: undefined, refs: undefined }
      },
      'glyph_1': {
        'node_2.y': { updater: 34, params: undefined, refs: undefined }
      }
    };
    const action4 = updatePropMeta('node_1', 'y', { updater: 56, formula: '' });
    const stateAfter4 = {
      'glyph_0': {
        'node_0.x': { updater: 12, params: undefined, refs: undefined }
      },
      'glyph_1': {
        'node_2.y': { updater: 34, params: undefined, refs: undefined }
      }
    };

    deepFreeze(graph);
    deepFreeze(stateBefore);
    deepFreeze(action1);
    deepFreeze(stateAfter1);
    deepFreeze(action2);
    deepFreeze(stateAfter2);
    deepFreeze(action3);
    deepFreeze(stateAfter3);
    deepFreeze(action4);
    deepFreeze(stateAfter4);

    expect(reducer(stateBefore, action1, graph)).to.deep.equal(stateAfter1);
    expect(reducer(stateAfter1, action2, graph)).to.deep.equal(stateAfter2);
    expect(reducer(stateAfter2, action3, graph)).to.deep.equal(stateAfter3);
    expect(reducer(stateAfter3, action4, graph)).to.deep.equal(stateAfter4);

    done();
  });

  it('should handle UPDATE_PARAM_META action', (done) => {
    const stateBefore = {};
    const action1 = updateParamMeta('node_0', '$width', { updater: 12, formula: '12' });
    const stateAfter1 = {
      'node_0': {
        '$width': { updater: 12, params: undefined, refs: undefined }
      }
    };
    const action2 = updateParamMeta('node_0', '$height', { updater: 34, formula: '34' });
    const stateAfter2 = {
      'node_0': {
        '$width': { updater: 12, params: undefined, refs: undefined },
        '$height': { updater: 34, params: undefined, refs: undefined }
      }
    };
    const action3 = updateParamMeta('node_0', '$width', { updater: 56, formula: '56' });
    const stateAfter3 = {
      'node_0': {
        '$width': { updater: 56, params: undefined, refs: undefined },
        '$height': { updater: 34, params: undefined, refs: undefined }
      }
    };
    const action4 = updateParamMeta('node_0', '$height', { updater: 56, formula: '' });
    const stateAfter4 = {
      'node_0': {
        '$width': { updater: 56, params: undefined, refs: undefined }
      }
    };

    deepFreeze(graph);
    deepFreeze(stateBefore);
    deepFreeze(action1);
    deepFreeze(stateAfter1);
    deepFreeze(action2);
    deepFreeze(stateAfter2);
    deepFreeze(action3);
    deepFreeze(stateAfter3);
    deepFreeze(action4);
    deepFreeze(stateAfter4);

    expect(reducer(stateBefore, action1, graph)).to.deep.equal(stateAfter1);
    expect(reducer(stateAfter1, action2, graph)).to.deep.equal(stateAfter2);
    expect(reducer(stateAfter2, action3, graph)).to.deep.equal(stateAfter3);
    expect(reducer(stateAfter3, action4, graph)).to.deep.equal(stateAfter4);

    done();
  });
});
