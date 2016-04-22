require('styles/text/TextNode.scss');

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {
  renderTextChild,
  mapStateToProps,
  mapDispatchToProps
} from './_utils';

import NodeProperties from './NodeProperties';
import Foldable from './Foldable';

class TextOncurve extends Component {
  constructor(props) {
    super(props);
    this.renderTextChild = renderTextChild.bind(this);
  }
  render() {
    const { id, type, _isUnfolded, offcurveIds } = this.props;
    const nodeClass = classNames({
      'text-node': true,
      'text-node--oncurve': true,
      'text-node--unfolded': _isUnfolded
    });

    return (
      <Foldable id={id}>
        <ul className={nodeClass}>
          <li><NodeProperties id={id} type={type} /></li>
          <li>
            <ul className="text-node__children-list unstyled">
              {offcurveIds.map(this.renderTextChild)}
            </ul>
          </li>
        </ul>
      </Foldable>
    );
  }
}

TextOncurve.propTypes = {
  actions: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(TextOncurve);
