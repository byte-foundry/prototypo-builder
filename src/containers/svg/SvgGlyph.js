import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  renderSvgChild,
  renderSelectionAreas,
  mapStateToProps,
  mapDispatchToProps,
} from './_utils';

class SvgGlyph extends Component {
  render() {
    const { childIds } = this.props;
    const children = childIds.map(renderSvgChild.bind(this));
    const selectionAreas = childIds.map(renderSelectionAreas.bind(this));
    return (
      <g>
        {children}
        {selectionAreas}
      </g>
    );
  }
}

SvgGlyph.propTypes = {
  actions: PropTypes.object.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(SvgGlyph);
