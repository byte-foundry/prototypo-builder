import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  renderSvgChild,
  // renderSelectedChild,
  mapStateToProps,
  mapDispatchToProps
} from './_utils';

class SvgRoot extends Component {
  constructor(props) {
    super(props);
    this.renderSvgChild = renderSvgChild.bind(this);
    // this.renderSelectedChild = renderSelectedChild.bind(this);
  }

  render() {
    const { childIds } = this.props;
    return (
      <g>
        {childIds.map(this.renderSvgChild)}
      </g>
    );
  }
}

SvgRoot.propTypes = {
  actions: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(SvgRoot);
