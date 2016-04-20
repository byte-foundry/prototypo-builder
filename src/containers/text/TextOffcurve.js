require('styles/text/TextNode.scss');

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  mapStateToProps,
  mapDispatchToProps,
  renderTextProperties,
  handleInput
} from './_utils';

class TextOffcurve extends Component {
  constructor(props) {
    super(props);
    this.handleInput = handleInput.bind(this);
    this.renderTextProperties = renderTextProperties.bind(this);
  }

  render() {
    return (
      <ul className="text-node text-node--offcurve unstyled">
        <li>{this.renderTextProperties()}</li>
      </ul>
    );
  }
}

TextOffcurve.propTypes = {
  actions: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(TextOffcurve);
