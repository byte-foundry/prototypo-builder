require('styles/text/TextNode.scss');

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {
  mapStateToProps,
  mapDispatchToProps
} from './_utils';

import NodeProperties from './NodeProperties';
import Foldable from './Foldable';

class TextOncurve extends Component {
  render() {
    const { id, type, _isUnfolded } = this.props;
    const nodeClass = classNames({
      'text-node': true,
      'text-node--oncurve': true,
      'text-node--unfolded': _isUnfolded
    });

    return (
      <Foldable id={id}>
        <ul className={nodeClass}>
          <li><NodeProperties id={id} type={type} /></li>
        </ul>
      </Foldable>
    );
  }
}

TextOncurve.propTypes = {
  actions: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(TextOncurve);
