import React, {
  Component,
  PropTypes
} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import Main from '../components/Main';

class TextNode extends Component {
  constructor(props) {
    super(props);
    this.handleRemoveClick = this.handleRemoveClick.bind(this);
    this.handleAddChildClick = this.handleAddChildClick.bind(this);
    this.renderChild = this.renderChild.bind(this);
  }

  handleAddChildClick(e) {
    e.preventDefault();

    const { addChild, createNode, id } = this.props;
    const childId = createNode().nodeId;
    addChild(id, childId);
  }

  handleRemoveClick(e) {
    e.preventDefault();

    const { removeChild, deleteNode, parentId, id } = this.props;
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
    const { parentId, childIds } = this.props
    return (
      <div>
        {typeof parentId !== 'undefined' ?
          <a href="#" onClick={this.handleRemoveClick}
             style={{ color: 'lightgray', textDecoration: 'none' }}>
            ×
          </a> :
          null
        }
        <ul>
          {childIds.map(this.renderChild)}
          <li key="add">
            <a href="#" onClick={this.handleAddChildClick}>
              Add child
            </a>
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
  return state[ownProps.id];
}

function mapDispatchToProps(dispatch) {
  const actions = {};
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}

const ConnectedNode = connect(mapStateToProps, mapDispatchToProps)(TextNode);
export default ConnectedNode;
