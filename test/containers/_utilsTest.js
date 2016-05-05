import deepFreeze from 'deep-freeze';

import { buildArgs, getCalculatedNode } from '../../src/containers/_utils';

describe('containers/_utils', () => {
  describe('buildArgs', () => {
    it('should build an array of arguments to be passed to updater.apply', (done) => {
      const params = {
        $width: 12,
        $height: 34,
        $expand: 56
      };

      deepFreeze(params);

      expect(buildArgs(null, params, []))
        .to.deep.equal([]);

      expect(buildArgs(null, params, ['$expand', '$width']))
        .to.deep.equal([ 56, 12 ]);

      done();
    });
  });

  describe('getCalculatedNode', () => {
    it('should replace props with calculatedProps', (done) => {
      const nodeBefore = {
        id: 'node-0',
        xMeta: {
          updater: () => 78,
          params: []
        },
        expandMeta: {
          updater: () => 90,
          params: []
        },
        x: 12,
        y: 34,
        expand: 56
      };
      const nodeAfter = {
        id: 'node-0',
        x: 78,
        y: 34,
        expand: 90
      }

      // I can't deepFreeze an object that contains functions apparently
      // deepFreeze(nodeBefore);

      expect(getCalculatedNode(nodeBefore, {})).to.deep.equal(nodeAfter);

      done();
    });
  });
});
