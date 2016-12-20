import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  renderSvgChild,
  mapStateToProps,
  mapDispatchToProps,
} from './_utils';

class SvgRoot extends PureComponent {
  constructor(props) {
    super(props);
    this.renderSvgChild = renderSvgChild.bind(this);
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
  actions: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(SvgRoot);
