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
    this.handleAddCurveClick = this.handleAddCurveClick.bind(this);
    this.renderTextChild = renderTextChild.bind(this);
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
    const { id, childIds } = this.props;
    return (
      <ul>
        <li>Path: {id}</li>
        <li>Points:
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
