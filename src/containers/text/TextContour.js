import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  renderTextChild,
  validateChildTypes,
  mapStateToProps,
  mapDispatchToProps
} from './_utils';

class TextContour extends Component {
  constructor(props) {
    super(props);
    this.handleAddPathClick = this.handleAddPathClick.bind(this);
    this.handleAddStartingPathClick = this.handleAddStartingPathClick.bind(this);
    this.renderTextChild = renderTextChild.bind(this);
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
      addPath
    } = this.props.actions;

    const pathId = createPath().nodeId;
    addPath(id, pathId);

    const oncurveId = createOncurve().nodeId;
    addOncurve(pathId, oncurveId);
  }

  render() {
    const { childIds } = this.props;
    return (
      <ul className="unstyled">
        <li>Paths:
          <ul>
            {childIds.map(this.renderTextChild)}
            <li><button onClick={this.handleAddStartingPathClick}>Add Path</button></li>
          </ul>
        </li>
      </ul>
    );
  }
}

TextContour.propTypes = {
  actions: PropTypes.object.isRequired,
  childTypes: validateChildTypes
}

export default connect(mapStateToProps, mapDispatchToProps)(TextContour);
