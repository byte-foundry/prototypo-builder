import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  renderSvgChild,
  mapStateToProps,
  mapDispatchToProps,
} from './_utils';

class SvgFont extends Component {
  render() {
    const { childIds } = this.props;
    return (
      <g>
        {childIds.map(renderSvgChild.bind(this))}
      </g>
    );
  }
}

SvgFont.propTypes = {
  actions: PropTypes.object.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(SvgFont);
