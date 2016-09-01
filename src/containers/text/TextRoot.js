import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  renderTextChild,
  validateChildTypes,
  mapStateToProps,
  mapDispatchToProps,
} from './_utils';

class TextRoot extends Component {
  constructor(props) {
    super(props);
    this.renderTextChild = renderTextChild.bind(this);
  }

  render() {
    const { childIds } = this.props;
    return (
      <ul className="unstyled">
        {childIds.map(this.renderTextChild)}
      </ul>
    );
  }
}

TextRoot.propTypes = {
  actions: PropTypes.object.isRequired,
  childTypes: validateChildTypes,
}

export default connect(mapStateToProps, mapDispatchToProps)(TextRoot);
