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
import SvgContourSelection from './SvgContourSelection';

import {
  updateProp
} from './../../actions/all';

const componentMap = {
  contour: SvgContour,
  font: SvgFont,
  glyph: SvgGlyph
};

const selectionComponentMap = {
  contour: SvgContourSelection
}

export function renderSvgChild(childId) {
  const { id } = this.props;
  const childType = childId.split('-')[0];
  const SvgNode = componentMap[childType];

  return [
    <SvgNode key={childId} id={childId} parentId={id} />
  ];
}

export function renderSelectionAreas(childId) {
  const { id } = this.props;
  const childType = childId.split('-')[0];
  const SvgNode = selectionComponentMap[childType];

  return [
    <SvgNode key={childId} id={childId} parentId={id} />
  ];
}

export function mapStateToProps(state, ownProps) {
  return state.nodes[ownProps.id];
}

export function mapDispatchToProps(dispatch) {
  const actions = {
    updateProp
  };
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}
