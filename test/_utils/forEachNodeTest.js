import forEachNode from '../../src/_utils/forEachNode';

describe('forEachNode', () => {
  describe('path.isClosed === false', () => {
    let nodes;
    const callback = function() {
      nodes.push( [... arguments] );
    }

    beforeEach(() => {
      nodes = [];
    });

    it('should iterate on a path containing a single oncurve', (done) => {
      const state = {
        'node-0': {
          id: 'node-0',
          childIds: ['node-1']
        },
        'node-1': {
          id: 'node-1'
        }
      };
      const node0 = [
        { id: 'node-1' },
        null,
        null,
        0
      ];

      forEachNode('node-0', state, callback);

      expect(nodes.length).to.equal(1);
      expect(nodes[0]).to.deep.equal( node0 );

      done();
    });

    it('should iterate twice on a path containing two oncurves', (done) => {
      const state = {
        'node-0': {
          id: 'node-0',
          childIds: ['node-1', 'node-2', 'node-3', 'node-4']
        },
        'node-1': {
          id: 'node-1'
        },
        'node-2': {
          id: 'node-2'
        },
        'node-3': {
          id: 'node-3'
        },
        'node-4': {
          id: 'node-4'
        }
      };
      const node0 = [
        { id: 'node-1' },
        null,
        { id: 'node-2' },
        0
      ];
      const node1 = [
        { id: 'node-4' },
        { id: 'node-3' },
        null,
        1
      ];

      forEachNode('node-0', state, callback);

      expect(nodes.length).to.equal(2);
      expect(nodes[0]).to.deep.equal(node0);
      expect(nodes[1]).to.deep.equal(node1);

      done();
    });

    it('should iterate thrice on a path containing three oncurves', (done) => {
      const state = {
        'node-0': {
          id: 'node-0',
          childIds: [
            'node-1', 'node-2', 'node-3', 'node-4', 'node-5', 'node-6', 'node-7'
          ]
        },
        'node-1': {
          id: 'node-1'
        },
        'node-2': {
          id: 'node-2'
        },
        'node-3': {
          id: 'node-3'
        },
        'node-4': {
          id: 'node-4'
        },
        'node-5': {
          id: 'node-5'
        },
        'node-6': {
          id: 'node-6'
        },
        'node-7': {
          id: 'node-7'
        }
      };
      const node0 = [
        { id: 'node-1' },
        null,
        { id: 'node-2' },
        0
      ];
      const node1 = [
        { id: 'node-4' },
        { id: 'node-3' },
        { id: 'node-5' },
        1
      ];
      const node2 = [
        { id: 'node-7' },
        { id: 'node-6' },
        null,
        2
      ];

      forEachNode('node-0', state, callback);

      expect(nodes.length).to.equal(3);
      expect(nodes[0]).to.deep.equal(node0);
      expect(nodes[1]).to.deep.equal(node1);
      expect(nodes[2]).to.deep.equal(node2);

      done();
    });
  });

  describe('path.isClosed === true', () => {
    let nodes;
    const callback = function() {
      nodes.push( [... arguments] );
    }

    beforeEach(() => {
      nodes = [];
    });

    it('should iterate on a path containing a single oncurve', (done) => {
      const state = {
        'node-0': {
          id: 'node-0',
          isClosed: true,
          childIds: ['node-1']
        },
        'node-1': {
          id: 'node-1'
        }
      };
      const node0 = [
        { id: 'node-1' },
        null,
        null,
        0
      ];

      forEachNode('node-0', state, callback);

      expect(nodes.length).to.equal(1);
      expect(nodes[0]).to.deep.equal( node0 );

      done();
    });

    it('should iterate twice on a path containing two oncurves', (done) => {
      const state = {
        'node-0': {
          id: 'node-0',
          isClosed: true,
          childIds: ['node-1', 'node-2', 'node-3', 'node-4']
        },
        'node-1': {
          id: 'node-1'
        },
        'node-2': {
          id: 'node-2'
        },
        'node-3': {
          id: 'node-3'
        },
        'node-4': {
          id: 'node-4'
        }
      };
      const node0 = [
        { id: 'node-1' },
        { id: 'node-3' },
        { id: 'node-2' },
        0
      ];
      const node1 = [
        { id: 'node-4' },
        { id: 'node-3' },
        { id: 'node-2' },
        1
      ];

      forEachNode('node-0', state, callback);

      expect(nodes.length).to.equal(2);
      expect(nodes[0]).to.deep.equal(node0);
      expect(nodes[1]).to.deep.equal(node1);

      done();
    });

    it('should iterate thrice on a path containing three oncurves', (done) => {
      const state = {
        'node-0': {
          id: 'node-0',
          isClosed: true,
          childIds: [
            'node-1', 'node-2', 'node-3', 'node-4', 'node-5', 'node-6', 'node-7'
          ]
        },
        'node-1': {
          id: 'node-1'
        },
        'node-2': {
          id: 'node-2'
        },
        'node-3': {
          id: 'node-3'
        },
        'node-4': {
          id: 'node-4'
        },
        'node-5': {
          id: 'node-5'
        },
        'node-6': {
          id: 'node-6'
        },
        'node-7': {
          id: 'node-7'
        }
      };
      const node0 = [
        { id: 'node-1' },
        { id: 'node-6' },
        { id: 'node-2' },
        0
      ];
      const node1 = [
        { id: 'node-4' },
        { id: 'node-3' },
        { id: 'node-5' },
        1
      ];
      const node2 = [
        { id: 'node-7' },
        { id: 'node-6' },
        { id: 'node-2' },
        2
      ];

      forEachNode('node-0', state, callback);

      expect(nodes.length).to.equal(3);
      expect(nodes[0]).to.deep.equal(node0);
      expect(nodes[1]).to.deep.equal(node1);
      expect(nodes[2]).to.deep.equal(node2);

      done();
    });
  });
});
