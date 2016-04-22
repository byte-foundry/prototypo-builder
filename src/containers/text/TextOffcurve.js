require('styles/text/TextNode.scss');

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  mapStateToProps,
  mapDispatchToProps
} from './_utils';

import TextNodeProperties from './TextNodeProperties';

class TextOffcurve extends Component {
  render() {
    const { id, type } = this.props;

    return (
      <ul className="text-node text-node--offcurve unstyled">
        <li><TextNodeProperties id={id} type={type} /></li>
      </ul>
    );
  }
}

TextOffcurve.propTypes = {
  actions: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(TextOffcurve);
