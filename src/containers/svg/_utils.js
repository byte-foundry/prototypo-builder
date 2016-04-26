import React from 'react';
import { bindActionCreators } from 'redux';

// import {
//   createPath,
//   addPath,
//   createOncurve,
//   addOncurve,
//   createOffcurve,
//   addOffcurve,
//   updateProp
// } from './../../actions/all';

import SvgContour from './SvgContour';
import SvgFont from './SvgFont';
import SvgGlyph from './SvgGlyph';

const componentMap = {
  contour: SvgContour,
  font: SvgFont,
  glyph: SvgGlyph
};

export function renderSvgChild(childId) {
  const { id } = this.props;
  const childType = childId.split('-')[0];
  const SvgNode = componentMap[childType];

  return (
    <SvgNode key={childId} id={childId} parentId={id} />
  );
}

export function mapStateToProps(state, ownProps) {
  return state.nodes[ownProps.id];
}

export function mapDispatchToProps(dispatch) {
  const actions = {
  };
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}
