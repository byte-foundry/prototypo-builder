require('styles/text/TextNode.scss');

import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {
  renderTextChild,
  shouldBeUnfolded,
  mapStateToProps,
  mapDispatchToProps,
} from './_utils';

import Foldable from './Foldable';

class TextOncurve extends PureComponent {
  constructor(props) {
    super(props);
    this.renderTextChild = renderTextChild.bind(this);
    this.shouldBeUnfolded = shouldBeUnfolded.bind(this);
  }
  render() {
    const { id, parentId, offcurveIds } = this.props;

    const nodeClass = classNames({
      'text-node': true,
      'text-node--path': true,
      'text-node--unfolded': this.shouldBeUnfolded(),
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
