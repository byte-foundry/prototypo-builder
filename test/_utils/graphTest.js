import deepFreeze from 'deep-freeze';

import {
  getAllDescendants,
  getParentId,
  getParentIdMemoized,
  getNodeType,
  getNodePath,
  getSegmentIds,
} from '../../src/_utils/graph';

describe('graph', () => {
  describe('getAllDescendants', () => {
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

      expect(getAllDescendants(graph, 'root')).to.deep.equal(expected);

      done();
    });
  });

  describe('gatParentId', () => {
    it('should return the id of the parent node', (done) => {
      const nodes = {
        'root': {
          childIds: ['node-0'],
        },
        'node-0': {
          childIds: [],
        },
      };

      expect(getParentId(nodes, 'node-0')).to.equal('root');

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

      expect(getParentIdMemoized(nodes, 'node-0', cache)).to.equal('root');
      expect(getParentIdMemoized(nodes, 'node-1', cache)).to.equal('root');
      expect(cache['node-1']).to.equal('root');

      done();
    });
  });

  describe('getNodeType', () => {
    it('should extract the node type from the node id', (done) => {
      const nodeId = 'font_UNIQUE';
      const node = { id: 'glyph_UNIQUE' };

      expect(getNodeType(nodeId)).to.equal('font');
      expect(getNodeType(node)).to.equal('glyph');

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

      expect(getNodePath(nodes, 'node-3')).to.deep.equal(expected);

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
        .to.deep.equal(['node-0', 'node-1']);
      expect(getSegmentIds(nodes, 'node-0', 'node-3'))
        .to.deep.equal(['node-0', 'node-1', 'node-2', 'node-3']);
      expect(getSegmentIds(nodes, 'node-4', 'node-3'))
        .to.deep.equal(['node-4', 'node-3']);
      expect(getSegmentIds(nodes, 'node-4', 'node-2'))
        .to.deep.equal(['node-4', 'node-3', 'node-2']);

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
      }).to.throw(Error);

      done();
    });
  });
});
