import deepFreeze from 'deep-freeze';

import {
  parseFormula,
  buildArgs,
  // getCalculatedProps,
  getCalculatedParams,
  getSolvingOrder,
  getCalculatedGlyph
} from '../../src/containers/_utils';

describe('containers/_utils', () => {
  describe('parseFormula', () => {
    it('should return a formula with isInvalid === true when the formula can\'t be parsed', (done) => {
      const strFormula = '$width * ';
      const expected = {
        formula: strFormula,
        isInvalid: true
      };

      expect(parseFormula(strFormula)).to.deep.equal(expected);

      done();
    });

    it('should parse a vail formula and extract params and refs', (done) => {
      const strFormula = '( $width * $height ) + ( glyph.oncurve_0.x - glyph.oncurve_1.x ) * 2';

      const result = parseFormula(strFormula);

      expect(result.isInvalid).to.equal(false);
      expect(result.updater).to.be.a('function');
      expect(result.params).to.deep.equal(['$width', '$height']);
      expect(result.refs).to.deep.equal(['oncurve_0.x', 'oncurve_1.x']);

      done();
    });
  });

  describe('buildArgs', () => {
    it('should build an array of arguments to be passed to updater.apply', (done) => {
      const params = {
        $width: 12,
        $height: 34,
        $expand: 56
      };

      deepFreeze(params);

      expect(buildArgs(null, params, []))
        .to.deep.equal([null]);

      expect(buildArgs(null, params, ['$expand', '$width']))
        .to.deep.equal([ null, 56, 12 ]);

      done();
    });
  });

  // describe('getCalculatedProps', () => {
  //   it('should replace props with calculatedProps', (done) => {
  //     const nodesBefore = {
  //       'node-0': {
  //         id: 'node-0',
  //         xMeta: {
  //           _for: 'x',
  //           updater: () => 78,
  //           params: []
  //         },
  //         expandMeta: {
  //           _for: 'expand',
  //           updater: () => 90,
  //           params: []
  //         },
  //         x: 12,
  //         y: 34,
  //         expand: 56
  //       }
  //     };
  //     const propsAfter = {
  //       id: 'node-0',
  //       x: 78,
  //       y: 34,
  //       expand: 90
  //     }
  //
  //     // I can't deepFreeze an object that contains functions apparently
  //     // deepFreeze(nodeBefore);
  //
  //     expect(getCalculatedProps(nodesBefore, {}, 'node-0'))
  //       .to.deep.equal(propsAfter);
  //
  //     done();
  //   });
  // });

  describe('getCalculatedParams', () => {
    it('should replace params with calculatedParams', (done) => {
      const stateBefore = {
        nodes: {
          'node-0': {
            id: 'node-0',
            params: {
              width: 12
            },
            paramsMeta: {
              _order: ['width', 'expand', 'distrib'],
              width: {},
              expand: {
              },
              distrib: {
              }
            }
          }
        },
        updaters: {
          'node-0': {
            expand: {
              updater: () => 34,
              params: []
            },
            distrib: {
              updater: () => 56,
              params: []
            }
          }
        }
      };
      const parentParams = {};
      const paramsAfter = {
        width: 12,
        expand: 34,
        distrib: 56
      };

      deepFreeze(parentParams);
      // I can't deepFreeze an object that contains functions apparently
      // deepFreeze(nodeBefore);

      expect(getCalculatedParams(stateBefore, parentParams, 'node-0'))
        .to.deep.equal(paramsAfter);

      done();
    });
  });

  describe('getSolvingOrder', () => {
    it('should return the solving order for this glyph', (done) => {
      const glyphUpdaters = {
        'node_0.x': { refs: ['node_1.x'] },
        'node_0.y': { refs: [] },
        'node_1.x': { refs: [] },
        'node_1.y': { refs: ['node_0.y'] }
      };
      const expected = [
        'node_1.x',
        'node_0.x',
        'node_0.y',
        'node_1.y'
      ];

      expect(getSolvingOrder(glyphUpdaters)).to.deep.equal(expected);

      done();
    });
  });

  describe('getCalculatedGlyph', () => {
    it('should return a subset of the graph that includes all children of the glyph', (done) => {
      // ... and all properties of these nodes should be 'calculated'

      const stateBefore = {
        nodes: {
          'root': {
            id: 'root',
            type: 'root',
            childIds: ['font_initial']
          },
          'font_initial': {
            id: 'font_initial',
            type: 'font',
            childIds: ['glyph_initial'],
            params: {},
            paramsMeta: { _order: [] }
          },
          'glyph_initial': {
            id: 'glyph_initial',
            type: 'glyph',
            childIds: ['contour_initial'],
            params: {},
            paramsMeta: { _order: [] }
          },
          'contour_initial': {
            id: 'contour_initial',
            type: 'contour',
            childIds: ['node_0', 'node_1']
          },
          'node_0': {
            id: 'node_0',
            type: 'path',
            x: 12,
            y: 34,
            isClosed: true,
            childIds: []
          },
          'node_1': {
            id: 'node_1',
            type: 'path',
            expand: 56,
            childIds: ['node_2', 'node_3']
          },
          'node_2': {
            id: 'node_2',
            type: 'path',
            childIds: []
          },
          'node_3': {
            id: 'node_3',
            type: 'path',
            childIds: []
          }
        },
        updaters: {
          'glyph_initial': {
            'node_0.x': { updater: () => 21, refs: ['node_1.x'], params: [] },
            'node_0.y': { updater: () => 43, refs: ['node_1.x'], params: [] },
            'node_1.x': { updater: () => 78, refs: [], params: ['$width'] }
          }
        }
      };

      const expected = {
        'contour_initial': {
          id: 'contour_initial',
          type: 'contour',
          childIds: ['node_0', 'node_1']
        },
        'node_0': {
          id: 'node_0',
          type: 'path',
          x: 21,
          y: 43,
          isClosed: true,
          childIds: []
        },
        'node_1': {
          id: 'node_1',
          type: 'path',
          x: 78,
          expand: 56,
          childIds: ['node_2', 'node_3']
        },
        'node_2': {
          id: 'node_2',
          type: 'path',
          childIds: []
        },
        'node_3': {
          id: 'node_3',
          type: 'path',
          childIds: []
        }
      };

      deepFreeze(stateBefore.nodes);

      expect(getCalculatedGlyph(stateBefore, { '$width': 90 }, 'glyph_initial'))
        .to.deep.equal(expected);

      done();
    });
  });
});
