/*
 * This file creates a virtual node graph and bind action creators to it
 * Using it lets you calculate nodes without denormalizing the global state
 * It's most often used to store expanded skeletons.
 */
/* eslint-disable import/namespace */
import * as actions from '~/actions';
import nodesReducer from '~/reducers/nodes';

const virtualState = {
  nodes: {},
};

const virtualActions = {};

Object.keys(actions).forEach((actionName) => {
  virtualActions[actionName] = (...args) => {
    const action = actions[actionName]( ...args );

    virtualState.nodes = nodesReducer( virtualState.nodes, action );
    return action;
  };
});

const virtual = {
  state: virtualState,
  actions: virtualActions,
};

// Returns a cleared-up virtual state singloton + associated actions
// Caution: state.nodes is reset every time that function is called
// So you better save a reference to these nodes before its used again
// TODO: wheigh the pros and cons of such behavior.
//       - pros: devs will never forget to empty the virtual state
//       - cons: devs might get bitten by a reset
// Current decision: being bitten by a reset will probably cause the app to
// throw somewhere, so the error will be obvious, whereas forgetting to clear
// the virtual state is a silent memory-leak.
export default function(nodes = {}) {
  // Note that you can provide your own node-map
  virtual.state.nodes = nodes;
  return virtual;
}
