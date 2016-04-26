import forEachCurve from '../../src/_utils/forEachCurve';

describe('forEachCurve', () => {
  let curves;
  const callback = function() {
    curves.push( [... arguments] );
  }

  beforeEach(() => {
    curves = [];
  });

  it('should not iterate on a path containing a single oncurve', (done) => {
    const state = {
      'node-0': {
        id: 'node-0',
        childIds: ['node-1']
      },
      'node-1': {
        id: 'node-1'
      }
    };

    forEachCurve('node-0', state, callback);

    expect(curves.length).to.equal(0);

    done();
  });

  it('should iterate once on a path containing two oncurves', (done) => {
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
    const curve = [
      { id: 'node-1' },
      { id: 'node-2' },
      { id: 'node-3' },
      { id: 'node-4' },
      0
    ];

    forEachCurve('node-0', state, callback);

    expect(curves.length).to.equal(1);
    expect(curves[0]).to.deep.equal(curve);

    done();
  });

  it('should iterate twice on a path containing three oncurves', (done) => {
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
    const curve0 = [
      { id: 'node-1' },
      { id: 'node-2' },
      { id: 'node-3' },
      { id: 'node-4' },
      0
    ];
    const curve1 = [
      { id: 'node-4' },
      { id: 'node-5' },
      { id: 'node-6' },
      { id: 'node-7' },
      1
    ]

    forEachCurve('node-0', state, callback);

    expect(curves.length).to.equal(2);
    expect(curves[0]).to.deep.equal(curve0);
    expect(curves[1]).to.deep.equal(curve1);


    done();
  });
});
