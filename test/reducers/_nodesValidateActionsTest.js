import deepFreeze from 'deep-freeze';

import {
  updateProp,
  addChild
} from '../../src/actions/all';

import {
  validateUpdate,
  validateAdd,
  validateAction,
  validateGraph
} from '../../src/reducers/_nodesValidateActions';

describe('reducers/_nodesValidateAction', () => {
  describe('validateUpdate', () => {
    it('should check if property update is allowed by the model', (done) => {
      const state = {
        'node-0': {
          id: 'node-0',
          type: 'ab'
        }
      };
      const model = {
        ab: { properties: { isVisible: true } }
      };
      const actionAllowed = updateProp('node-0', 'isVisible', true);
      const actionForbidden = updateProp('node-0', 'isSkeleton', true);

      deepFreeze(state);
      deepFreeze(model);
      deepFreeze(actionAllowed);
      deepFreeze(actionForbidden);

      expect(validateUpdate( state, actionAllowed, model ))
        .to.not.be.an('error');
      expect(validateUpdate( state, actionForbidden, model ))
        .to.be.an('error');

      done();
    });
  });

  describe('validateAdd', () => {
    it('should check if node insertion is allowed by the model', (done) => {
      const state = {
        'node-0': {
          id: 'node-0',
          type: 'ab'
        },
        'node-1': {
          id: 'node-1',
          type: 'cd'
        }
      };
      const model = {
        ab: { children: { cd: true } },
        cd: { children: {} }
      };
      const actionAllowed = addChild('node-0', 'node-1');
      const actionForbidden = addChild('node-1', 'node-0');

      deepFreeze(state);
      deepFreeze(model);
      deepFreeze(actionAllowed);
      deepFreeze(actionForbidden);

      expect(validateAdd( state, actionAllowed, model ))
        .to.not.be.an('error');
      expect(validateAdd( state, actionForbidden, model ))
        .to.be.an('error');

      done();
    });
  });

  describe('validateAction', () => {
    it(`should check that actions that have a node type in their type
        (e.g. ADD_GLYPH) target a node of the appropriate type`, (done) => {

      expect(false).to.be.true;

      done();
    });
  });

  describe('validateGraph', () => {
    it(`should check that the node about to be added in the graph is not
        already present in the graph`, (done) => {

      expect(false).to.be.true;

      done();
    });
  });
});
