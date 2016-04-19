import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  mapStateToProps,
  mapDispatchToProps
} from './_utils';

class TextOncurve extends Component {
  render() {
    const { id, type } = this.props;
    return (
      <span>{id}: {type}</span>
    );
  }
}

TextOncurve.propTypes = {
  actions: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(TextOncurve);
