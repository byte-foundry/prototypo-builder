import React, {
  Component,
  PropTypes
} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class TextNode extends Component {
  constructor(props) {
    super(props);
    this.handleRemoveClick = this.handleRemoveClick.bind(this);
    this.handleAddChildClick = this.handleAddChildClick.bind(this);
    this.renderChild = this.renderChild.bind(this);
  }

  handleAddChildClick(e) {
    e.preventDefault();

    const { id } = this.props;
    const { addChild, createNode } = this.props.actions;
    const childId = createNode().nodeId;
    addChild(id, childId);
  }

  handleRemoveClick(e) {
    e.preventDefault();

    const { parentId, id } = this.props;
    const { removeChild, deleteNode } = this.props.actions;
    removeChild(parentId, id);
    deleteNode(id);
  }

  renderChild(childId) {
    const { id } = this.props;
    return (
      <li key={childId}>
        <ConnectedNode id={childId} parentId={id} />
      </li>
    );
  }

  render() {
    const { id, type, parentId, childIds } = this.props
    return (
      <div>id: {id}, type: {type}
        {typeof parentId !== 'undefined' ?
          <input type="button" value="×" onClick={this.handleRemoveClick} /> :
          null
        }
        <ul>
          {childIds.map(this.renderChild)}
          <li key="add">
            <input type="button" value="+" onClick={this.handleAddChildClick} />
          </li>
        </ul>
      </div>
    )
  }
}

TextNode.propTypes = {
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return state.nodes[ownProps.id];
}

function mapDispatchToProps(dispatch) {
  const actions = {
    createNode: require('../actions/nodes/createNode.js'),
    deleteNode: require('../actions/nodes/deleteNode.js'),
    addChild: require('../actions/nodes/addChild.js'),
    removeChild: require('../actions/nodes/removeChild.js')
  };
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}

const ConnectedNode = connect(mapStateToProps, mapDispatchToProps)(TextNode);
export default ConnectedNode;
