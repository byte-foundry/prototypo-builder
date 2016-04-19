import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  renderTextChild,
  validateChildTypes,
  mapStateToProps,
  mapDispatchToProps
} from './_utils';

class TextFont extends Component {
  render() {
    const { childIds } = this.props;
    return (
      <ul>
        {childIds.map(renderTextChild.bind(this))}
      </ul>
    );
  }
}

TextFont.propTypes = {
  actions: PropTypes.object.isRequired,
  childTypes: validateChildTypes
}

export default connect(mapStateToProps, mapDispatchToProps)(TextFont);
