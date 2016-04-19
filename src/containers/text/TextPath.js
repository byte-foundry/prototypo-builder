import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

// import TextOncurve from './TextOncurve';
// import TextOffcurve from './TextOffcurve';

import {
  renderTextChild,
  validateChildTypes,
  mapStateToProps,
  mapDispatchToProps
} from './_utils';

class TextGlyph extends Component {
  constructor(props) {
    super(props);
    this.handleAddOncurveClick = this.handleAddOncurveClick.bind(this);
    this.handleAddOffcurveClick = this.handleAddOffcurveClick.bind(this);
  }

  handleAddOncurveClick(e) {
    e.preventDefault();

    const { id } = this.props;
    const { addChild, createNode } = this.props.actions;
    const childId = createNode().nodeId;
    addChild(id, childId);
  }

  handleAddOffcurveClick(e) {
    e.preventDefault();

    const { id } = this.props;
    const { addChild, createNode } = this.props.actions;
    const childId = createNode().nodeId;
    addChild(id, childId);
  }

  render() {
    const { id, childIds, type } = this.props;
    return (
      <ul>
        <li>Path: {id}</li>
        <li>Points:
          <ul>
            {childIds.map((childId) => {
              return (
                <li key={childId}>type: {type}</li>
              );
            })}
            <li>
              <button onClick={this.handleAddOncurveClick}>Add Oncurve</button>
              <button onClick={this.handleAddOffcurveClick}>Add Offcurve</button>
            </li>
          </ul>
        </li>
      </ul>
    );
  }
}

TextGlyph.propTypes = {
  actions: PropTypes.object.isRequired,
  childTypes: validateChildTypes
}

export default connect(mapStateToProps, mapDispatchToProps)(TextGlyph);
