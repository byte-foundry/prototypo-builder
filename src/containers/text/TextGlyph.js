import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  renderTextChild,
  validateChildTypes,
  mapStateToProps,
  mapDispatchToProps,
} from './_utils';

class TextGlyph extends Component {
  constructor(props) {
    super(props);
    this.handleAddContourClick = this.handleAddContourClick.bind(this);
  }

  handleAddContourClick(e) {
    e.preventDefault();

    const { id } = this.props;
    const {
      addContour,
      createContour,
    } = this.props.actions;

    const pathId = createContour().nodeId;
    addContour(id, pathId);
  }

  render() {
    const { childIds } = this.props;
    return (
      <ul className="unstyled">
        {childIds.map(renderTextChild.bind(this))}
        <li><button onClick={this.handleAddContourClick}>Add Contour</button></li>
      </ul>
    );
  }
}

TextGlyph.propTypes = {
  actions: PropTypes.object.isRequired,
  childTypes: validateChildTypes,
}

export default connect(mapStateToProps, mapDispatchToProps)(TextGlyph);
