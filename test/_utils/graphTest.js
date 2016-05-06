import deepFreeze from 'deep-freeze';

import {
  getAllDescendants
} from '../../src/_utils/graph';

describe('graph', () => {
  describe('getAllDescendants', () => {
    it('should extract all descendants of a node from the graph', (done) => {
      const graph = {
        'root': {
          childIds: ['node-0', 'node-1']
        },
        'node-0': {
          childIds: []
        },
        'node-1': {
          childIds: ['node-2', 'node-3']
        },
        'node-2': {
          childIds: []
        },
        'node-3': {
          childIds: []
        },
        'node-4': {
          childIds: []
        }
      };
      const expected = {
        'node-0': {
          childIds: []
        },
        'node-1': {
          childIds: ['node-2', 'node-3']
        },
        'node-2': {
          childIds: []
        },
        'node-3': {
          childIds: []
        }
      };

      deepFreeze(graph);

      expect(getAllDescendants(graph, 'root')).to.deep.equal(expected);

      done();
    });
  });
});
