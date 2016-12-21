import {
  forEachCurve,
  forEachNode,
  mapCurve,
  mapNode,
  getNode,
} from '../../src/_utils/Path';

describe('Path', () => {
  describe('forEachCurve', () => {
    let curves;
    const callback = function() {
      curves.push( [... arguments] );
    };

    beforeEach(() => {
      curves = [];
    });

    it('should not iterate on a path containing a single oncurve', (done) => {
      const state = {
        'node-0': {
          id: 'node-0',
          childIds: ['node-1'],
        },
        'node-1': {
          id: 'node-1',
        },
      };

      forEachCurve('node-0', state, callback);

      expect(curves.length).toEqual(0);

      done();
    });

    it('should iterate once on a path containing two oncurves', (done) => {
      const state = {
        'node-0': {
          id: 'node-0',
          childIds: ['node-1', 'node-2', 'node-3', 'node-4'],
        },
        'node-1': {
          id: 'node-1',
        },
        'node-2': {
          id: 'node-2',
        },
        'node-3': {
          id: 'node-3',
        },
        'node-4': {
          id: 'node-4',
        },
      };
      const curve = [
        { id: 'node-1' },
        { id: 'node-2' },
        { id: 'node-3' },
        { id: 'node-4' },
        0,
        1,
      ];

      forEachCurve('node-0', state, callback);

      expect(curves.length).toEqual(1);
      expect(curves[0]).toEqual(curve);

      done();
    });

    it('should iterate twice on a path containing three oncurves', (done) => {
      const state = {
        'node-0': {
          id: 'node-0',
          childIds: [
            'node-1', 'node-2', 'node-3', 'node-4', 'node-5', 'node-6', 'node-7',
          ],
        },
        'node-1': {
          id: 'node-1',
        },
        'node-2': {
          id: 'node-2',
        },
        'node-3': {
          id: 'node-3',
        },
        'node-4': {
          id: 'node-4',
        },
        'node-5': {
          id: 'node-5',
        },
        'node-6': {
          id: 'node-6',
        },
        'node-7': {
          id: 'node-7',
        },
      };
      const curve0 = [
        { id: 'node-1' },
        { id: 'node-2' },
        { id: 'node-3' },
        { id: 'node-4' },
        0,
        2,
      ];
      const curve1 = [
        { id: 'node-4' },
        { id: 'node-5' },
        { id: 'node-6' },
        { id: 'node-7' },
        1,
        2,
      ];

      forEachCurve('node-0', state, callback);

      expect(curves.length).toEqual(2);
      expect(curves[0]).toEqual(curve0);
      expect(curves[1]).toEqual(curve1);


      done();
    });
  });

  describe('mapCurve', () => {
    const callback = function() {
      return [...arguments, arguments[arguments.length - 2] * 10 + 1];
    };

    it('should return the mapped curves', (done) => {
      const state = {
        'node-0': {
          id: 'node-0',
          childIds: [
            'node-1', 'node-2', 'node-3', 'node-4', 'node-5', 'node-6', 'node-7',
          ],
        },
        'node-1': {
          id: 'node-1',
        },
        'node-2': {
          id: 'node-2',
        },
        'node-3': {
          id: 'node-3',
        },
        'node-4': {
          id: 'node-4',
        },
        'node-5': {
          id: 'node-5',
        },
        'node-6': {
          id: 'node-6',
        },
        'node-7': {
          id: 'node-7',
        },
      };
      const expected = [
        [
          { id: 'node-1' },
          { id: 'node-2' },
          { id: 'node-3' },
          { id: 'node-4' },
          0,
          2,
          1,
        ],
        [
          { id: 'node-4' },
          { id: 'node-5' },
          { id: 'node-6' },
          { id: 'node-7' },
          1,
          2,
          11,
        ],
      ];

      const result = mapCurve('node-0', state, callback);

      expect(result).toEqual(expected);

      done();
    });
  });

  describe('forEachNode', () => {
    describe('path.isClosed === false', () => {
      let nodes;
      const callback = function() {
        nodes.push( [... arguments] );
      };

      beforeEach(() => {
        nodes = [];
      });

      it('should iterate on a path containing a single oncurve', (done) => {
        const state = {
          'node-0': {
            id: 'node-0',
            childIds: ['node-1'],
          },
          'node-1': {
            id: 'node-1',
          },
        };
        const node0 = [
          { id: 'node-1' },
          null,
          null,
          0,
          1,
        ];

        forEachNode('node-0', state, callback);

        expect(nodes.length).toEqual(1);
        expect(nodes[0]).toEqual( node0 );

        done();
      });

      it('should iterate twice on a path containing two oncurves', (done) => {
        const state = {
          'node-0': {
            id: 'node-0',
            childIds: ['node-1', 'node-2', 'node-3', 'node-4'],
          },
          'node-1': {
            id: 'node-1',
          },
          'node-2': {
            id: 'node-2',
          },
          'node-3': {
            id: 'node-3',
          },
          'node-4': {
            id: 'node-4',
          },
        };
        const node0 = [
          { id: 'node-1' },
          null,
          { id: 'node-2' },
          0,
          2,
        ];
        const node1 = [
          { id: 'node-4' },
          { id: 'node-3' },
          null,
          1,
          2,
        ];

        forEachNode('node-0', state, callback);

        expect(nodes.length).toEqual(2);
        expect(nodes[0]).toEqual(node0);
        expect(nodes[1]).toEqual(node1);

        done();
      });

      it('should iterate thrice on a path containing three oncurves', (done) => {
        const state = {
          'node-0': {
            id: 'node-0',
            childIds: [
              'node-1', 'node-2', 'node-3', 'node-4', 'node-5', 'node-6', 'node-7',
            ],
          },
          'node-1': {
            id: 'node-1',
          },
          'node-2': {
            id: 'node-2',
          },
          'node-3': {
            id: 'node-3',
          },
          'node-4': {
            id: 'node-4',
          },
          'node-5': {
            id: 'node-5',
          },
          'node-6': {
            id: 'node-6',
          },
          'node-7': {
            id: 'node-7',
          },
        };
        const node0 = [
          { id: 'node-1' },
          null,
          { id: 'node-2' },
          0,
          3,
        ];
        const node1 = [
          { id: 'node-4' },
          { id: 'node-3' },
          { id: 'node-5' },
          1,
          3,
        ];
        const node2 = [
          { id: 'node-7' },
          { id: 'node-6' },
          null,
          2,
          3,
        ];

        forEachNode('node-0', state, callback);

        expect(nodes.length).toEqual(3);
        expect(nodes[0]).toEqual(node0);
        expect(nodes[1]).toEqual(node1);
        expect(nodes[2]).toEqual(node2);

        done();
      });
    });

    describe('path.isClosed === true', () => {
      let nodes;
      const callback = function() {
        nodes.push( [... arguments] );
      };

      beforeEach(() => {
        nodes = [];
      });

      it('should iterate on a path containing a single oncurve', (done) => {
        const state = {
          'node-0': {
            id: 'node-0',
            isClosed: true,
            childIds: ['node-1'],
          },
          'node-1': {
            id: 'node-1',
          },
        };
        const node0 = [
          { id: 'node-1' },
          null,
          null,
          0,
          1,
        ];

        forEachNode('node-0', state, callback);

        expect(nodes.length).toEqual(1);
        expect(nodes[0]).toEqual( node0 );

        done();
      });

      it('should iterate twice on a path containing two oncurves', (done) => {
        const state = {
          'node-0': {
            id: 'node-0',
            isClosed: true,
            childIds: ['node-1', 'node-2', 'node-3', 'node-4'],
          },
          'node-1': {
            id: 'node-1',
          },
          'node-2': {
            id: 'node-2',
          },
          'node-3': {
            id: 'node-3',
          },
          'node-4': {
            id: 'node-4',
          },
        };
        const node0 = [
          { id: 'node-1' },
          { id: 'node-3' },
          { id: 'node-2' },
          0,
          2,
        ];
        const node1 = [
          { id: 'node-1' },
          { id: 'node-3' },
          { id: 'node-2' },
          1,
          2,
        ];

        forEachNode('node-0', state, callback);

        expect(nodes.length).toEqual(2);
        expect(nodes[0]).toEqual(node0);
        expect(nodes[1]).toEqual(node1);

        done();
      });

      it('should iterate thrice on a path containing three oncurves', (done) => {
        const state = {
          'node-0': {
            id: 'node-0',
            isClosed: true,
            childIds: [
              'node-1', 'node-2', 'node-3', 'node-4', 'node-5', 'node-6', 'node-7',
            ],
          },
          'node-1': {
            id: 'node-1',
          },
          'node-2': {
            id: 'node-2',
          },
          'node-3': {
            id: 'node-3',
          },
          'node-4': {
            id: 'node-4',
          },
          'node-5': {
            id: 'node-5',
          },
          'node-6': {
            id: 'node-6',
          },
          'node-7': {
            id: 'node-7',
          },
        };
        const node0 = [
          { id: 'node-1' },
          { id: 'node-6' },
          { id: 'node-2' },
          0,
          3,
        ];
        const node1 = [
          { id: 'node-4' },
          { id: 'node-3' },
          { id: 'node-5' },
          1,
          3,
        ];
        const node2 = [
          { id: 'node-1' },
          { id: 'node-6' },
          { id: 'node-2' },
          2,
          3,
        ];

        forEachNode('node-0', state, callback);

        expect(nodes.length).toEqual(3);
        expect(nodes[0]).toEqual(node0);
        expect(nodes[1]).toEqual(node1);
        expect(nodes[2]).toEqual(node2);

        done();
      });
    });
  });

  describe('mapNode', () => {
    const callback = function() {
      return [...arguments, arguments[arguments.length - 2] * 10 + 1];
    };

    it('should return mapped Nodes', (done) => {
      const state = {
        'node-0': {
          id: 'node-0',
          isClosed: true,
          childIds: [
            'node-1', 'node-2', 'node-3', 'node-4', 'node-5', 'node-6', 'node-7',
          ],
        },
        'node-1': {
          id: 'node-1',
        },
        'node-2': {
          id: 'node-2',
        },
        'node-3': {
          id: 'node-3',
        },
        'node-4': {
          id: 'node-4',
        },
        'node-5': {
          id: 'node-5',
        },
        'node-6': {
          id: 'node-6',
        },
        'node-7': {
          id: 'node-7',
        },
      };
      const expected = [
        [
          { id: 'node-1' },
          { id: 'node-6' },
          { id: 'node-2' },
          0,
          3,
          1,
        ],
        [
          { id: 'node-4' },
          { id: 'node-3' },
          { id: 'node-5' },
          1,
          3,
          11,
        ],
        [
          { id: 'node-1' },
          { id: 'node-6' },
          { id: 'node-2' },
          2,
          3,
          21,
        ],
      ];

      const result = mapNode('node-0', state, callback);

      expect(result).toEqual(expected);

      done();
    });
  });



  describe('getNode', () => {
    it('should get me the correct node', (done) => {
      const state = {
        'node-0': {
          id: 'node-0',
          isClosed: true,
          childIds: [
            'node-1', 'node-2', 'node-3', 'node-4', 'node-5', 'node-6', 'node-7',
          ],
        },
        'node-1': {
          id: 'node-1',
        },
        'node-2': {
          id: 'node-2',
        },
        'node-3': {
          id: 'node-3',
        },
        'node-4': {
          id: 'node-4',
        },
        'node-5': {
          id: 'node-5',
        },
        'node-6': {
          id: 'node-6',
        },
        'node-7': {
          id: 'node-7',
        },
      };

      const expected0 = [
        {
          id: 'node-1',
        },
        {
          id: 'node-6',
        },
        {
          id: 'node-2',
        },
        {
          id: 'node-7',
        },
      ];

      const expected1 = [
        {
          id: 'node-4',
        },
        {
          id: 'node-3',
        },
        {
          id: 'node-5',
        },
      ];

      const expected2 = [
        {
          id: 'node-1',
        },
        {
          id: 'node-6',
        },
        {
          id: 'node-2',
        },
        {
          id: 'node-7',
        },
      ];

      // get node by oncurve
      const result0 = getNode('node-0', 'node-1', state);
      const result1 = getNode('node-0', 'node-4', state);
      const result2 = getNode('node-0', 'node-7', state);
      // get node by offcurve
      const result3 = getNode('node-0', 'node-2', state);
      const result4 = getNode('node-0', 'node-3', state);

      expect(result0).toEqual(expected0);
      expect(result1).toEqual(expected1);
      expect(result2).toEqual(expected2);
      expect(result3).toEqual(expected0);
      expect(result4).toEqual(expected1);
      done();
    });
  });

  describe('getPrevNode', () => {
    it('should return the previous node', () => {
      // TODO: write the tests!
      expect(false).toEqual(true);
    });
  });

  describe('getNextNode', () => {
    it('should return the next node', () => {
      // TODO: write the tests!
      expect(false).toEqual(true);
    });
  });

  describe('findClosestPath', () => {
    it('should return the path closest to a point', () => {
      // TODO: write the tests!
      expect(false).toEqual(true);
    });
  });

  describe('findClosestNode', () => {
    it('should return the node closest to a path', () => {
      // TODO: write the tests!
      expect(false).toEqual(true);
    });
  });
});
