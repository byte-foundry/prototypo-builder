import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {
  renderTextChild,
  validateChildTypes,
  shouldBeUnfolded,
  mapStateToProps,
  mapDispatchToProps,
} from './_utils';

import Foldable from './Foldable';
import TextOncurve from './TextOncurve';

class TextGlyph extends PureComponent {
  constructor(props) {
    super(props);
    this.renderTextChild = renderTextChild.bind(this);
    this.renderTextCurve = this.renderTextCurve.bind(this);
    this.shouldBeUnfolded = shouldBeUnfolded.bind(this);
    this.handleAddCurveClick = this.handleAddCurveClick.bind(this);
  }

  handleAddCurveClick(e) {
    e.preventDefault();

    const { id } = this.props;
    const {
      createOffcurve,
      addOffcurve,
      createOncurve,
      addOncurve,
    } = this.props.actions;
    const offcurve1Id = createOffcurve().nodeId;
    const offcurve2Id = createOffcurve().nodeId;
    const oncurveId = createOncurve(this.props.ui.baseExpand).nodeId;
    addOffcurve(id, offcurve1Id);
    addOffcurve(id, offcurve2Id);
    addOncurve(id, oncurveId);
  }

  renderTextCurve(childId, i) {
    const { id, childIds } = this.props;
    const isOncurve = /^oncurve[-_]/.test(childId);

    // We only render oncurve points, and wrap following offcurves in a Foldable
    if ( !isOncurve ) {
      return null;
    }

    const offcurveIds = [];
    if ( /^offcurve[-_]/.test(childIds[i-1]) ) {
        offcurveIds.push(childIds[i-1]);
    }
    if ( /^offcurve[-_]/.test(childIds[i+1]) ) {
        offcurveIds.push(childIds[i+1]);
    }

    return (
      <li key={childId}>
        <TextOncurve id={childId} parentId={id} offcurveIds={offcurveIds} />
      </li>
    );
  }

  render() {
    const { id, childIds} = this.props;
    const nodeClass = classNames({
      'text-node': true,
      'text-node--path': true,
      'text-node--unfolded': this.shouldBeUnfolded(),
    });

    return (
      <Foldable id={id} switchProp="_isChildrenUnfolded">
        <ul className={nodeClass}>
          <li>
            <ul className="text-node__children-list unstyled">
              {childIds.map(this.renderTextCurve)}
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
  childTypes: validateChildTypes,
};

export default connect(mapStateToProps, mapDispatchToProps)(TextGlyph);
