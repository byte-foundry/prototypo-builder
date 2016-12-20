import deepFreeze from 'deep-freeze';

import {
  getDescendants,
  _getParentId,
  getParentIdMemoized,
  getNodeType,
  getNodePath,
  getSegmentIds,
} from '../../src/_utils/Graph';

describe('graph', () => {
  describe('getDescendants', () => {
    it('should extract all descendants of a node from the graph', (done) => {
      const graph = {
        'root': {
          childIds: ['node-0', 'node-1'],
        },
        'node-0': {
          childIds: [],
        },
        'node-1': {
          childIds: ['node-2', 'node-3'],
        },
        'node-2': {
          childIds: [],
        },
        'node-3': {
          childIds: [],
        },
        'node-4': {
          childIds: [],
        },
      };
      const expected = {
        'node-0': {
          childIds: [],
        },
        'node-1': {
          childIds: ['node-2', 'node-3'],
        },
        'node-2': {
          childIds: [],
        },
        'node-3': {
          childIds: [],
        },
      };

      deepFreeze(graph);

      expect(getDescendants(graph, 'root')).toEqual(expected);

      done();
    });
  });

  describe('getParentId', () => {
    it('should return the id of the parent node', (done) => {
      const nodes = {
        'root': {
          childIds: ['node-0'],
        },
        'node-0': {
          childIds: [],
        },
      };

      expect(_getParentId(nodes, 'node-0')).toEqual('root');

      done();
    });
  });

  describe('getParentIdMemoized', () => {
    it('should return the id of the parent node', (done) => {
      const nodes = {
        'root': {
          childIds: ['node-0', 'node-1'],
        },
        'node-0': {
          childIds: [],
        },
        'node-1': {
          childIds: [],
        },
      };

      const cache = {
        'node-0': 'root',
        'node-1': 'node-0',
      };

      expect(getParentIdMemoized(nodes, 'node-0', cache)).toEqual('root');
      expect(getParentIdMemoized(nodes, 'node-1', cache)).toEqual('root');
      expect(cache['node-1']).toEqual('root');

      done();
    });
  });

  describe('getNodeType', () => {
    it('should extract the node type from the node id', (done) => {
      const nodeId = 'font_UNIQUE';

      expect(getNodeType(nodeId)).toEqual('font');

      done();
    });
  });

  describe('getNodePath', () => {
    it('should return the path to a specific node in the graph', (done) => {
      const nodes = {
        'root': {
          childIds: ['node-0'],
        },
        'node-0': {
          childIds: ['node-1'],
        },
        'node-1': {
          childIds: ['node-2', 'node-3', 'node-4'],
        },
        'node-2': {
          childIds: [],
        },
      };
      const expected = ['root', 'node-0', 'node-1'];

      expect(getNodePath(nodes, 'node-3')).toEqual(expected);

      done();
    });
  });

  describe('getSegmentIds', () => {
    it('should return the ids of all nodes in a segment of the graph', (done) => {
      const nodes = {
        'path': {
          childIds: ['node-0', 'node-1', 'node-2', 'node-3', 'node-4'],
        },
        'node-0': {
          childIds: [],
        },
        'node-1': {
          childIds: [],
        },
        'node-2': {
          childIds: [],
        },
        'node-3': {
          childIds: [],
        },
        'node-4': {
          childIds: [],
        },
      };

      expect(getSegmentIds(nodes, 'node-0', 'node-1'))
        .toEqual(['node-0', 'node-1']);
      expect(getSegmentIds(nodes, 'node-0', 'node-3'))
        .toEqual(['node-0', 'node-1', 'node-2', 'node-3']);
      expect(getSegmentIds(nodes, 'node-4', 'node-3'))
        .toEqual(['node-4', 'node-3']);
      expect(getSegmentIds(nodes, 'node-4', 'node-2'))
        .toEqual(['node-4', 'node-3', 'node-2']);

      done();
    });

    it('should throw when the second childId isn\'t a sibling of the first one', (done) => {
      const nodes = {
        'path': {
          childIds: ['node-0'],
        },
        'node-0': {
          childIds: [],
        },
      };

      expect(() => {
        getSegmentIds(nodes, 'node-0', 'node-1');
      }).toThrow(Error);

      done();
    });
  });
});
