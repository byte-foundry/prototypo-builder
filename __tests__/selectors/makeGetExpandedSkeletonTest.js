import {
  childrenEqualityCheck,
  memoizeNodeAndChildren,
  expandPath,
} from './../../src/selectors/makeGetExpandedSkeleton';

describe('makeGetExpandedSkeleton', () => {
  describe('childrenEqualityCheck', () => {
    it('should return true when childIds point to the same nodes', (done) => {
      const nodes = {
        'node-0': {
          id: 'node-0',
          childIds: ['node-1', 'node-2'],
        },
        'node-1': { id: 'node-1' },
        'node-2': { id: 'node-2' },
      }
      const previousNodes = Object.assign({}, nodes);
      const currentNodes = Object.assign({}, nodes);

      expect(currentNodes).toEqual(previousNodes);
      expect(childrenEqualityCheck('node-0', currentNodes, previousNodes))
        .toEqual(true);
      done();
    });

    it('should return true when childIds point to different nodes', (done) => {
      const nodes = {
        'node-0': {
          id: 'node-0',
          childIds: ['node-1', 'node-2'],
        },
        'node-1': { id: 'node-1' },
        'node-2': { id: 'node-2' },
      }
      const previousNodes = Object.assign({}, nodes);
      const currentNodes = Object.assign({}, nodes, {'node-2': { id: 'node-2' }});

      expect(currentNodes).toEqual(previousNodes);
      expect(childrenEqualityCheck('node-0', currentNodes, previousNodes))
        .toEqual(false);
      done();
    });
  });

  describe('memoizeNodeAndChildren', () => {
    it('should memoize a result when the cache is empty', (done) => {
      const nodes = {
        'node-0': {
          id: 'node-0',
          childIds: ['node-1', 'node-2'],
        },
        'node-1': { id: 'node-1' },
        'node-2': { id: 'node-2' },
      };
      const lastNodes = null;
      const cache = {};
      const func = () => {
        return 123;
      };
      const memoizer = memoizeNodeAndChildren(func, lastNodes, cache);

      expect(memoizer(nodes, 'node-0')).toEqual(123);
      expect(cache).toEqual({'node-0': 123});

      done();
    });

    it('should return a cached result when nodes are the same', (done) => {
      const nodes = {
        'node-0': {
          id: 'node-0',
          childIds: ['node-1', 'node-2'],
        },
        'node-1': { id: 'node-1' },
        'node-2': { id: 'node-2' },
      };
      const lastNodes = Object.assign({}, nodes);
      const cache = {'node-0': 456};
      const func = () => {
        return 123;
      };
      const memoizer = memoizeNodeAndChildren(func, lastNodes, cache);

      expect(nodes).toEqual(lastNodes);
      expect(memoizer(nodes, 'node-0')).toEqual(456);
      expect(cache).toEqual({'node-0': 456});

      done();
    });

    it('should return a fresh result when the parent node has changed', (done) => {
      const nodes = {
        'node-0': {
          id: 'node-0',
          childIds: ['node-1', 'node-2'],
        },
        'node-1': { id: 'node-1' },
        'node-2': { id: 'node-2' },
      };
      const lastNodes = Object.assign({}, nodes, {
        'node-0': {
          id: 'node-0',
          childIds: ['node-1', 'node-2'],
        },
      });
      const cache = {'node-0': 456};
      const func = () => {
        return 123;
      };
      const memoizer = memoizeNodeAndChildren(func, lastNodes, cache);

      expect(nodes).toEqual(lastNodes);
      expect(memoizer(nodes, 'node-0')).toEqual(123);
      expect(cache).toEqual({'node-0': 123});

      done();
    });

    it('should return a fresh result when a child node has changed', (done) => {
      const nodes = {
        'node-0': {
          id: 'node-0',
          childIds: ['node-1', 'node-2'],
        },
        'node-1': { id: 'node-1' },
        'node-2': { id: 'node-2' },
      };
      const lastNodes = Object.assign({}, nodes, {
        'node-2': { id: 'node-2' },
      });
      const cache = {'node-0': 456};
      const func = () => {
        return 123;
      };
      const memoizer = memoizeNodeAndChildren(func, lastNodes, cache);

      expect(nodes).toEqual(lastNodes);
      expect(memoizer(nodes, 'node-0')).toEqual(123);
      expect(cache).toEqual({'node-0': 123});

      done();
    });
  });

  describe('expandPath', () => {
    it('should return a closed path when expanding a non-closed path', (done) => {
      const nodes = {
        'node-0': {
          id: 'node-0',
          type: 'path',
          isClosed: false,
          childIds: ['node-1', 'node-2', 'node-3', 'node-4', 'node-5', 'node-6', 'node-7'],
        },
        'node-1': {
          id: 'node-1',
          type: 'oncurve',
          x: 0,
          y: 0,
        },
        'node-2': {
          id: 'node-2',
          type: 'offcurve',
          x: 0,
          y: 0,
        },
        'node-3': {
          id: 'node-3',
          type: 'offcurve',
          x: 0,
          y: 0,
        },
        'node-4': {
          id: 'node-4',
          type: 'oncurve',
          x: 0,
          y: 0,
        },
        'node-5': {
          id: 'node-5',
          type: 'offcurve',
          x: 0,
          y: 0,
        },
        'node-6': {
          id: 'node-6',
          type: 'offcurve',
          x: 0,
          y: 0,
        },
        'node-7': {
          id: 'node-7',
          type: 'oncurve',
          x: 0,
          y: 0,
        },
      };

      const calculatedNodes = {};



      done();
    });
  });
});
