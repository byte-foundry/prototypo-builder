import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {
  renderTextChild,
  validateChildTypes,
  mapStateToProps,
  mapDispatchToProps
} from './_utils';

import NodeProperties from './NodeProperties';
import Foldable from './Foldable';

class TextGlyph extends Component {
  constructor(props) {
    super(props);
    this.renderTextChild = renderTextChild.bind(this);
    this.handleAddCurveClick = this.handleAddCurveClick.bind(this);
  }

  handleAddCurveClick(e) {
    e.preventDefault();

    const { id } = this.props;
    const {
      createOffcurve,
      addOffcurve,
      createOncurve,
      addOncurve
    } = this.props.actions;
    const offcurve1Id = createOffcurve().nodeId;
    const offcurve2Id = createOffcurve().nodeId;
    const oncurveId = createOncurve().nodeId;
    addOffcurve(id, offcurve1Id);
    addOffcurve(id, offcurve2Id);
    addOncurve(id, oncurveId);
  }

  render() {
    const { id, type, childIds, _isUnfolded } = this.props;
    const nodeClass = classNames({
      'text-node': true,
      'text-node--path': true,
      'text-node--unfolded': _isUnfolded
    });

    return (
      <Foldable id={id}>
        <ul className={nodeClass}>
          <li><NodeProperties id={id} type={type} /></li>
          <li>
            <ul className="text-node__children-list unstyled">
              {childIds.map(this.renderTextChild)}
              <li>
                <button onClick={this.handleAddCurveClick}>Add Curve</button>
              </li>
            </ul>
          </li>
        </ul>
      </Foldable>
    );
  }
}

TextGlyph.propTypes = {
  actions: PropTypes.object.isRequired,
  childTypes: validateChildTypes
}

export default connect(mapStateToProps, mapDispatchToProps)(TextGlyph);
