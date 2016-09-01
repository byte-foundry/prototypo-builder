require('styles/text/TextNode.scss');

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {
  mapStateToProps,
  mapDispatchToProps,
} from './_utils';

import NodeProperties from './NodeProperties';
import Foldable from './Foldable';

class TextOffcurve extends Component {
  render() {
    const { id, type, _isPropsUnfolded } = this.props;
    const nodeClass = classNames({
      'text-node': true,
      'text-node--offcurve': true,
      'text-node--unfolded': _isPropsUnfolded,
    });

    return (
      <Foldable id={id} switchProp="_isPropsUnfolded">
        <ul className={nodeClass}>
          <li><NodeProperties id={id} type={type} /></li>
        </ul>
      </Foldable>
    );
  }
}

TextOffcurve.propTypes = {
  actions: PropTypes.object.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(TextOffcurve);
