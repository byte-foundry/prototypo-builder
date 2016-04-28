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
    const {actions, nodes, ui} = this.props;
    return <Main actions={actions} nodes={nodes} ui={ui}/>;
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
  ui: PropTypes.object.isRequired
};
function mapStateToProps(state) {
  /* Populated by react-webpack-redux:reducer */
  const props = {
    nodes: state.nodes,
    ui: state.ui
  };
  return props;
}
function mapDispatchToProps(dispatch) {
  /* Populated by react-webpack-redux:action */
  const actions = {
    createNode: require('../actions/nodes/createNode.js'),
    deleteNode: require('../actions/nodes/deleteNode.js'),
    addChild: require('../actions/nodes/addChild.js'),
    addChildren: require('../actions/nodes/addChildren.js'),
    removeChild: require('../actions/nodes/removeChild.js'),
    updateProp: require('../actions/nodes/updateProp.js'),
    createGlyph: require('../actions/glyphs/createGlyph.js'),
    createFont: require('../actions/fonts/createFont.js'),
    addFont: require('../actions/fonts/addFont.js'),
    addGlyph: require('../actions/glyphs/addGlyph.js'),
    createContour: require('../actions/contours/createContour.js'),
    addContour: require('../actions/contours/addContour.js'),
    createPath: require('../actions/paths/createPath.js'),
    addPath: require('../actions/paths/addPath.js'),
    addCurve: require('../actions/paths/addCurve.js'),
    createCurve: require('../actions/paths/createCurve.js'),
    createOncurve: require('../actions/oncurves/createOncurve.js'),
    addOncurve: require('../actions/oncurves/addOncurve.js'),
    createOffcurve: require('../actions/offcurves/createOffcurve.js'),
    addOffcurve: require('../actions/offcurves/addOffcurve.js'),
    updateX: require('../actions/points/updateX.js'),
    updateY: require('../actions/points/updateY.js'),
    moveNode: require('../actions/nodes/moveNode.js')
  };
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
