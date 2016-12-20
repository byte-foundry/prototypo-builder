/* CAUTION: When using the generators, this file is modified in some places.
 *          This is done via AST traversal - Some of your formatting may be lost
 *          in the process - no functionality should be broken though.
 *          This modifications only run once when the generator is invoked - if
 *          you edit them, they are not updated again.
 */
import React, { PureComponent, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Main from '~/components/Main';

/* Populated by react-webpack-redux:reducer */
class App extends PureComponent {
  render() {
    const {actions, nodes, ui, updaters} = this.props;

    return (
      <Main
        actions={actions}
        nodes={nodes}
        ui={ui}
        updaters={updaters}/>
    );
  }
}
/* Populated by react-webpack-redux:reducer
 *
 * HINT: if you adjust the initial type of your reducer, you will also have to
 *       adjust it here.
 */
App.propTypes = {
  actions: PropTypes.object.isRequired,
  nodes: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
  formulas: PropTypes.object.isRequired,
};
function mapStateToProps(state) {
  /* Populated by react-webpack-redux:reducer */
  const props = {
    nodes: state.nodes,
    ui: state.ui,
    formulas: state.formulas,
  };

  return props;
}
function mapDispatchToProps(dispatch) {
  /* Populated by react-webpack-redux:action */
  const actions = {};
  const actionMap = { actions: bindActionCreators(actions, dispatch) };

  return actionMap;
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
