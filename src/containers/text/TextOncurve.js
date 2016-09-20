require('styles/text/TextNode.scss');

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {
  renderTextChild,
  mapStateToProps,
  mapDispatchToProps,
} from './_utils';

import NodeProperties from './NodeProperties';
import Foldable from './Foldable';

class TextOncurve extends Component {
  constructor(props) {
    super(props);
    this.renderTextChild = renderTextChild.bind(this);
  }
  render() {
    const { id, parentId, type, _isChildrenUnfolded, offcurveIds } = this.props;
    const nodeClass = classNames({
      'text-node': true,
      'text-node--oncurve': true,
      'text-node--unfolded': _isChildrenUnfolded,
    });

    return (
      <Foldable id={id} parentId={parentId} switchProp="_isChildrenUnfolded">
        <ul className={nodeClass}>
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
  actions: PropTypes.object.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(TextOncurve);
