import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {
  renderTextChild,
  shouldBeUnfolded,
  validateChildTypes,
  mapStateToProps,
  mapDispatchToProps,
} from './_utils';

import NodeProperties from './NodeProperties';
import Foldable from './Foldable';

class TextContour extends PureComponent {
  constructor(props) {
    super(props);
    this.handleAddPathClick = this.handleAddPathClick.bind(this);
    this.handleAddStartingPathClick = this.handleAddStartingPathClick.bind(this);
    this.renderTextChild = renderTextChild.bind(this);
    this.shouldBeUnfolded = shouldBeUnfolded.bind(this);
  }

  handleAddPathClick(e) {
    e.preventDefault();

    const { id } = this.props;
    const { addPath, createPath } = this.props.actions;
    const childId = createPath().nodeId;
    addPath(id, childId);
  }

  handleAddStartingPathClick(e) {
    e.preventDefault();

    const { id } = this.props;
    const {
      createOncurve,
      addOncurve,
      createPath,
      addPath,
    } = this.props.actions;

    const pathId = createPath().nodeId;
    addPath(id, pathId);

    const oncurveId = createOncurve(this.props.ui.baseExpand).nodeId;
    addOncurve(pathId, oncurveId);
  }

  handleSelect() {
    this.props.actions.setContourSelected(this.props.id);
  }

  render() {
    const { id, type, childIds, _isChildrenUnfolded } = this.props;
    const nodeClass = classNames({
      'text-node': true,
      'text-node--path': true,
      'text-node--unfolded': _isChildrenUnfolded,
    });

    return (
      <Foldable id={id} switchProp="_isChildrenUnfolded">
        <ul className={nodeClass}>
          <li>
            <button onClick={this.handleSelect.bind(this)}>Select Contour</button>
          </li>
          <li><NodeProperties id={id} type={type} /></li>
          <li>
            <ul className="unstyled">
              {childIds.map(this.renderTextChild)}
              <li><button onClick={this.handleAddStartingPathClick}>Add Path</button></li>
            </ul>
          </li>
        </ul>
      </Foldable>
    );
  }
}

TextContour.propTypes = {
  actions: PropTypes.object.isRequired,
  childTypes: validateChildTypes,
}

export default connect(mapStateToProps, mapDispatchToProps)(TextContour);
