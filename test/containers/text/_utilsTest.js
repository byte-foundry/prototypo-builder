import deepFreeze from 'deep-freeze';

import { validateChildTypes } from '../../../src/containers/text/_utils';

describe('containers/text/_utils', () => {
  describe('validateChildTypes', () => {
    const modelBefore = {
      ab: { cd: true, ef: true },
    };
    deepFreeze(modelBefore);

    it('should accept valid child types for the font model', (done) => {
      const propsBefore = {
        childTypes: { 'node-1': 'cd', 'node-2': 'ef', 'node-3': 'cd' },
      };

      deepFreeze(propsBefore);

      expect(validateChildTypes(propsBefore, 'childTypes', 'TextAb', null, modelBefore))
        .to.not.be.an('error');

      done();
    });

    it('should throw on invalid child types for the font model', (done) => {
      const propsBefore = {
        childTypes: { 'node-1': 'cd', 'node-2': 'ef', 'node-3': 'gh' },
      };

      deepFreeze(propsBefore);

      expect(validateChildTypes(propsBefore, 'childTypes', 'TextAb', null, modelBefore))
        .to.be.an('error');

      done();
    });
  });
});
