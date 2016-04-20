import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  renderTextChild,
  validateChildTypes,
  mapStateToProps,
  mapDispatchToProps,
  renderTextProperties
} from './_utils';

class TextGlyph extends Component {
  constructor(props) {
    super(props);
    this.renderTextProperties = renderTextProperties.bind(this);
    this.renderTextChild = renderTextChild.bind(this);
    this.handleAddCurveClick = this.handleAddCurveClick.bind(this);
  }

  handleAddCurveClick(e) {
    e.preventDefault();

    const { id } = this.props;
    const {
      createOffcurve,
      addOffcurve,
      createOncurve,
      addOncurve
    } = this.props.actions;
    const offcurve1Id = createOffcurve().nodeId;
    const offcurve2Id = createOffcurve().nodeId;
    const oncurveId = createOncurve().nodeId;
    addOffcurve(id, offcurve1Id);
    addOffcurve(id, offcurve2Id);
    addOncurve(id, oncurveId);
  }

  render() {
    const { childIds } = this.props;

    return (
      <ul className="text-node text-node--path unstyled">
        <li>{this.renderTextProperties()}</li>
        <li>
          <ul>
            {childIds.map(this.renderTextChild)}
            <li>
              <button onClick={this.handleAddCurveClick}>Add Curve</button>
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
