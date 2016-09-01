import deepFreeze from 'deep-freeze';

import {
  getAllDescendants,
  getParentNode,
  getParentNodeMemoized,
  getNodePath,
  getNodePathMemoized,
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

  describe('gatParentNode', () => {
    it('should return the id of the parent node', (done) => {
      const nodes = {
        'root': {
          childIds: ['node-0'],
        },
        'node-0': {
          childIds: [],
        },
      };

      expect(getParentNode(nodes, 'node-0')).to.equal('root');

      done();
    });
  });

  describe('getParentNodeMemoized', () => {
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

      expect(getParentNodeMemoized(nodes, 'node-0', cache)).to.equal('root');
      expect(getParentNodeMemoized(nodes, 'node-1', cache)).to.equal('root');
      expect(cache['node-1']).to.equal('root');

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

  // describe('getNodePathMemoized', () => {
  //   const cache = {};
  //
  //   it('should return the path to a specific node in the graph', (done) => {
  //     const nodes = {
  //       'root': {
  //         childIds: ['node-0']
  //       },
  //       'node-0': {
  //         childIds: ['node-1']
  //       },
  //       'node-1': {
  //         childIds: ['node-2', 'node-3', 'node-4']
  //       },
  //       'node-2': {
  //         childIds: []
  //       }
  //     };
  //     const expectedPath = ['root', 'node-0', 'node-1'];
  //     const expectedCache = { 'node-3': expectedPath };
  //
  //     expect(getNodePathMemoized(nodes, 'node-3', cache))
  //       .to.deep.equal(expectedPath);
  //     expect(cache).to.deep.equal(expectedCache);
  //
  //     done();
  //   });
  //
  //   it('should return the cached path', (done) => {
  //     const nodes = {
  //       'root': {
  //         childIds: ['node-0']
  //       },
  //       'node-0': {
  //         childIds: ['node-1']
  //       },
  //       'node-1': {
  //         childIds: ['node-2', 'node-3', 'node-4']
  //       },
  //       'node-2': {
  //         childIds: []
  //       }
  //     };
  //     const expectedPath = ['root', 'node-0', 'node-1'];
  //
  //     expect(cache).to.deep.equal({ 'node-3': expectedPath });
  //     expect(getNodePathMemoized(nodes, 'node-3', cache))
  //       .to.deep.equal(expectedPath);
  //     expect(cache).to.deep.equal({ 'node-3': expectedPath });
  //
  //     done();
  //   });
  //
  //   it('should return a new path if the cached path is wrong', (done) => {
  //     const nodes = {
  //       'root': {
  //         childIds: ['node-0']
  //       },
  //       'node-0': {
  //         childIds: ['node-1']
  //       },
  //       'node-1': {
  //         childIds: ['node-2']
  //       },
  //       'node-2': {
  //         childIds: ['node-4', 'node-3']
  //       },
  //       'node-4': {
  //         childIds: []
  //       }
  //     };
  //     const expectedPath = ['root', 'node-0', 'node-1', 'node-2'];
  //
  //     expect(cache).to.deep.equal({ 'node-3': expectedPath.slice(0,3) });
  //     expect(getNodePathMemoized(nodes, 'node-3', cache))
  //       .to.deep.equal(expectedPath);
  //     expect(cache).to.deep.equal({ 'node-3': expectedPath });
  //
  //     done();
  //   });
  // });
});
