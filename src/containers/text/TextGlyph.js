import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  renderTextChild,
  validateChildTypes,
  mapStateToProps,
  mapDispatchToProps
} from './_utils';

class TextGlyph extends Component {
  render() {
    const { childIds } = this.props;
    return (
      <ul className="unstyled">
        {childIds.map(renderTextChild.bind(this))}
      </ul>
    );
  }
}

TextGlyph.propTypes = {
  actions: PropTypes.object.isRequired,
  childTypes: validateChildTypes
}

export default connect(mapStateToProps, mapDispatchToProps)(TextGlyph);
