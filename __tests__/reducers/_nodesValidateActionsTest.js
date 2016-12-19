import deepFreeze from 'deep-freeze';

import * as actions from '../../src/actions';
import {
  validateUpdateProps,
  validateAddChildren,
  validateGraph,
  validateAddParam,
} from '~/reducers/_nodesValidateActions';

describe('reducers/_nodesValidateAction', () => {
  describe('validateUpdateProps', () => {
    it('should check if property update is allowed by the model', (done) => {
      const state = {
        'node-0': {
          id: 'node-0',
          type: 'ab',
        },
      };
      const model = {
        ab: { properties: { isVisible: true } },
      };
      const actionAllowed = actions.updateProp('node-0', 'isVisible', true);
      const actionForbidden = actions.updateProp('node-0', 'isSkeleton', true);

      deepFreeze(state);
      deepFreeze(model);
      deepFreeze(actionAllowed);
      deepFreeze(actionForbidden);

      expect(validateUpdateProps( state, actionAllowed, model ))
        .not.toBeInstanceOf(Error);
      expect(validateUpdateProps( state, actionForbidden, model ))
        .toBeInstanceOf(Error);

      done();
    });
  });

  describe('validateAddChildren', () => {
    it('should check if node insertion is allowed by the model', (done) => {
      const state = {
        'node-0': {
          id: 'node-0',
          type: 'ab',
        },
        'node-1': {
          id: 'node-1',
          type: 'cd',
        },
        'node-2': {
          id: 'node-2',
          type: 'ef',
        },
        'node-3': {
          id: 'node-2',
          type: 'gh',
        },
      };
      const model = {
        ab: { children: { cd: true, ef: true } },
        cd: { children: {} },
        ef: { children: {} },
        gh: { children: {} },
      };
      const actionAllowed = actions.addChild('node-0', 'node-1');
      const actionMultiAllowed = actions.addChildren('node-0', ['node-1', 'node-2']);
      const actionForbidden = actions.addChild('node-1', 'node-0');
      const actionMultiForbidden = actions.addChildren('node-0', ['node-1', 'node-3']);

      deepFreeze(state);
      deepFreeze(model);
      deepFreeze(actionAllowed);
      deepFreeze(actionMultiAllowed);
      deepFreeze(actionForbidden);
      deepFreeze(actionMultiForbidden);

      expect(validateAddChildren( state, actionAllowed, model ))
        .not.toBeInstanceOf(Error);
      expect(validateAddChildren( state, actionMultiAllowed, model ))
        .not.toBeInstanceOf(Error);
      expect(validateAddChildren( state, actionForbidden, model ))
        .toBeInstanceOf(Error);
      expect(validateAddChildren( state, actionMultiForbidden, model ))
        .toBeInstanceOf(Error);

      done();
    });
  });

  describe('validateGraph', () => {
    it(`should check that the node about to be added in the graph is not
        already present in the graph`, (done) => {

      const state = {
        'node-0': {
          id: 'node-0',
          childIds: ['node-1'],
        },
        'node-1': {
          id: 'node-1',
          childIds: [],
        },
        'node-2': {
          id: 'node-2',
          childIds: [],
        },
        'node-3': {
          id: 'node-3',
          childIds: [],
        },
      };

      const actionAllowed = actions.addChild('node-0', 'node-2');
      const actionMultiAllowed = actions.addChildren('node-0', ['node-2', 'node-3']);
      const actionForbidden = actions.addChild('node-2', 'node-1');
      const actionMultiForbidden = actions.addChildren('node-2', ['node-3', 'node-1']);

      deepFreeze(state);
      deepFreeze(actionAllowed);
      deepFreeze(actionMultiAllowed);
      deepFreeze(actionForbidden);
      deepFreeze(actionMultiForbidden);

      expect(validateGraph( state, actionAllowed ))
        .not.toBeInstanceOf(Error);
      expect(validateGraph( state, actionMultiAllowed ))
        .not.toBeInstanceOf(Error);
      expect(validateGraph( state, actionForbidden ))
        .toBeInstanceOf(Error);
      expect(validateGraph( state, actionMultiForbidden ))
        .toBeInstanceOf(Error);

      done();
    });
  });

  describe('validateAddParam', () => {
    it('should check that the param name starts with a $', (done) => {
      const state = {
        'node-0': {
          id: 'node-0',
        },
      };

      const actionAllowed = actions.addParam('node-0', '$allowed');
      const actionForbidden = actions.addParam('node-0', 'forbidden');

      deepFreeze(state);
      deepFreeze(actionAllowed);
      deepFreeze(actionForbidden);

      expect(validateAddParam( state, actionAllowed ))
        .not.toBeInstanceOf(Error);
      expect(validateAddParam( state, actionForbidden ))
        .toBeInstanceOf(Error);

      done();
    });

    // I'm not sure whether this test still makes sense or not
    // it('should check that the node doesn\'t have a param with the same name', (done) => {
    //   const state = {
    //     'node-0': {
    //       id: 'node-0',
    //       params: {
    //         $forbidden: 12
    //       },
    //       paramsMeta: {
    //         $forbidden: {}
    //       }
    //     }
    //   };
    //
    //   const actionAllowed = actions.addParam('node-0', '$allowed');
    //   const actionForbidden = actions.addParam('node-0', '$forbidden');
    //
    //   deepFreeze(state);
    //   deepFreeze(actionAllowed);
    //   deepFreeze(actionForbidden);
    //
    //   expect(validateAddParam( state, actionAllowed ))
    //     .not.toBeInstanceOf(Error);
    //   expect(validateAddParam( state, actionForbidden ))
    //     .toBeInstanceOf(Error);
    //
    //   done();
    // });
  });
});
