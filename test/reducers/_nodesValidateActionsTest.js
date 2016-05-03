import deepFreeze from 'deep-freeze';

import {
  updateProp,
  addChild,
  addChildren,
  addParam
} from '../../src/actions/all';

import {
  validateUpdateProps,
  validateAddChildren,
  validateGraph,
  validateAddParam
} from '../../src/reducers/_nodesValidateActions';

describe('reducers/_nodesValidateAction', () => {
  describe('validateUpdateProps', () => {
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

      expect(validateUpdateProps( state, actionAllowed, model ))
        .to.not.be.an('error');
      expect(validateUpdateProps( state, actionForbidden, model ))
        .to.be.an('error');

      done();
    });
  });

  describe('validateAddChildren', () => {
    it('should check if node insertion is allowed by the model', (done) => {
      const state = {
        'node-0': {
          id: 'node-0',
          type: 'ab'
        },
        'node-1': {
          id: 'node-1',
          type: 'cd'
        },
        'node-2': {
          id: 'node-2',
          type: 'ef'
        },
        'node-3': {
          id: 'node-2',
          type: 'gh'
        }
      };
      const model = {
        ab: { children: { cd: true, ef: true } },
        cd: { children: {} },
        ef: { children: {} },
        gh: { children: {} }
      };
      const actionAllowed = addChild('node-0', 'node-1');
      const actionMultiAllowed = addChildren('node-0', ['node-1', 'node-2']);
      const actionForbidden = addChild('node-1', 'node-0');
      const actionMultiForbidden = addChildren('node-0', ['node-1', 'node-3']);

      deepFreeze(state);
      deepFreeze(model);
      deepFreeze(actionAllowed);
      deepFreeze(actionMultiAllowed)
      deepFreeze(actionForbidden);
      deepFreeze(actionMultiForbidden)

      expect(validateAddChildren( state, actionAllowed, model ))
        .to.not.be.an('error');
      expect(validateAddChildren( state, actionMultiAllowed, model ))
        .to.not.be.an('error');
      expect(validateAddChildren( state, actionForbidden, model ))
        .to.be.an('error');
      expect(validateAddChildren( state, actionMultiForbidden, model ))
        .to.be.an('error');

      done();
    });
  });

  describe('validateGraph', () => {
    it(`should check that the node about to be added in the graph is not
        already present in the graph`, (done) => {

      const state = {
        'node-0': {
          id: 'node-0',
          childIds: ['node-1']
        },
        'node-1': {
          id: 'node-1',
          childIds: []
        },
        'node-2': {
          id: 'node-2',
          childIds: []
        },
        'node-3': {
          id: 'node-3',
          childIds: []
        }
      };

      const actionAllowed = addChild('node-0', 'node-2');
      const actionMultiAllowed = addChildren('node-0', ['node-2', 'node-3']);
      const actionForbidden = addChild('node-2', 'node-1');
      const actionMultiForbidden = addChildren('node-2', ['node-3', 'node-1']);

      deepFreeze(state);
      deepFreeze(actionAllowed);
      deepFreeze(actionMultiAllowed)
      deepFreeze(actionForbidden);
      deepFreeze(actionMultiForbidden)

      expect(validateGraph( state, actionAllowed ))
        .to.not.be.an('error');
      expect(validateGraph( state, actionMultiAllowed ))
        .to.not.be.an('error');
      expect(validateGraph( state, actionForbidden ))
        .to.be.an('error');
      expect(validateGraph( state, actionMultiForbidden ))
        .to.be.an('error');

      done();
    });
  });

  describe('validateAddParam', () => {
    it('should check that the param name starts with a $', (done) => {
      const state = {
        'node-0': {
          id: 'node-0'
        }
      };

      const actionAllowed = addParam('node-0', '$allowed');
      const actionForbidden = addParam('node-0', 'forbidden');

      deepFreeze(state);
      deepFreeze(actionAllowed);
      deepFreeze(actionForbidden);

      expect(validateAddParam( state, actionAllowed ))
        .to.not.be.an('error');
      expect(validateAddParam( state, actionForbidden ))
        .to.be.an('error');

      done();
    });

    it('should check that the node doesn\'t have a param with the same name', (done) => {
      const state = {
        'node-0': {
          id: 'node-0',
          params: [{
            name: '$forbidden'
          }]
        }
      };

      const actionAllowed = addParam('node-0', '$allowed');
      const actionForbidden = addParam('node-0', '$forbidden');

      deepFreeze(state);
      deepFreeze(actionAllowed);
      deepFreeze(actionForbidden);

      expect(validateAddParam( state, actionAllowed ))
        .to.not.be.an('error');
      expect(validateAddParam( state, actionForbidden ))
        .to.be.an('error');

      done();
    });
  });
});
