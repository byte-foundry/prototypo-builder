/* CAUTION: When using the generators, this file is modified in some places.
 *          This is done via AST traversal - Some of your formatting may be lost
 *          in the process - no functionality should be broken though.
 *          This modifications only run once when the generator is invoked - if
 *          you edit them, they are not updated again.
 */
import React, {
  Component,
  PropTypes
} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Main from '../components/Main';
/* Populated by react-webpack-redux:reducer */
class App extends Component {
  render() {
    const {actions, nodes} = this.props;
    return <Main actions={actions} nodes={nodes}/>;
  }
}
/* Populated by react-webpack-redux:reducer
 *
 * HINT: if you adjust the initial type of your reducer, you will also have to
 *       adjust it here.
 */
App.propTypes = {
  actions: PropTypes.object.isRequired,
  nodes: PropTypes.object.isRequired
};
function mapStateToProps(state) {
  /* Populated by react-webpack-redux:reducer */
  const props = { nodes: state.nodes };
  return props;
}
function mapDispatchToProps(dispatch) {
  /* Populated by react-webpack-redux:action */
  const actions = {
    createNode: require('../actions/nodes/createNode.js'),
    deleteNode: require('../actions/nodes/deleteNode.js'),
    addChild: require('../actions/nodes/addChild.js'),
    removeChild: require('../actions/nodes/removeChild.js'),
    createGlyph: require('../actions/glyphs/createGlyph.js'),
    createFont: require('../actions/fonts/createFont.js'),
    addFont: require('../actions/fonts/addFont.js'),
    addGlyph: require('../actions/glyphs/addGlyph.js')
  };
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
