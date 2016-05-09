import deepFreeze from 'deep-freeze';

import {
  parseFormula,
  buildArgs,
  getCalculatedProps,
  getCalculatedParams
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

  describe('getCalculatedProps', () => {
    it('should replace props with calculatedProps', (done) => {
      const nodesBefore = {
        'node-0': {
          id: 'node-0',
          xMeta: {
            _for: 'x',
            updater: () => 78,
            params: []
          },
          expandMeta: {
            _for: 'expand',
            updater: () => 90,
            params: []
          },
          x: 12,
          y: 34,
          expand: 56
        }
      };
      const propsAfter = {
        id: 'node-0',
        x: 78,
        y: 34,
        expand: 90
      }

      // I can't deepFreeze an object that contains functions apparently
      // deepFreeze(nodeBefore);

      expect(getCalculatedProps(nodesBefore, {}, 'node-0'))
        .to.deep.equal(propsAfter);

      done();
    });
  });

  describe('getCalculatedParams', () => {
    it('should replace params with calculatedParams', (done) => {
      const nodesBefore = {
        'node-0': {
          id: 'node-0',
          params: {
            width: 12
          },
          paramsMeta: {
            _order: ['width', 'expand', 'distrib'],
            width: {},
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

      expect(getCalculatedParams(nodesBefore, parentParams, 'node-0'))
        .to.deep.equal(paramsAfter);

      done();
    });
  });
});
