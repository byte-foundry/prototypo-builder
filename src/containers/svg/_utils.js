// This file should only be used to avoid repeating boilerplate code in containers.
// TODO: It is currently full of business logic. This logic should be moved back
// to appropriate files in ~/_utils/. The content of ~/containers/text/_utils is
// a better example of what can be expected in such files.
import React from 'react';
import { bindActionCreators } from 'redux';

import * as Path from '~/_utils/Path';
import * as Graph from '~/_utils/Graph';
import * as actions from '~/actions';

import SvgContour from './SvgContour';
import SvgFont from './SvgFont';
import SvgGlyph from './SvgGlyph';
import SvgContourSelection from './SvgContourSelection';

const componentMap = {
  contour: SvgContour,
  font: SvgFont,
  glyph: SvgGlyph,
};

const selectionComponentMap = {
  contour: SvgContourSelection,
};

export function renderSvgChild(childId) {
  const { id } = this.props;
  const childType = Graph.getNodeType(childId);
  const SvgNode = componentMap[childType];

  return [
    <SvgNode key={childId} id={childId} parentId={id} />,
  ];
}

export function renderSelectionAreas(childId) {
  const { id } = this.props;
  const childType = Graph.getNodeType(childId);
  const SvgNode = selectionComponentMap[childType];

  return [
    <SvgNode key={childId} id={childId} parentId={id} />,
  ];
}

export function renderPathData(pathId) {
  const { nodes } = this.props;

  if (nodes[pathId].isSkeleton) {
    return '';
  }

  return Path.mapCurve(pathId, nodes, (start, c1, c2, end, i, length) => {
    let sPoint = '';

    if ( i === 0 ) {
      sPoint += `M ${start.x || 0},${start.y || 0}`;
    }

    if ( end ) {
      sPoint +=
        `C ${c1.x || 0},${c1.y || 0} ${c2.x || 0},${c2.y || 0} ${end.x || 0} ${end.y || 0}`;
    }

    if ( i === length-1 && nodes[pathId].isClosed ) {
      sPoint += 'Z';
    }

    return sPoint;
  }).join(' ');
}

export function mapStateToProps(state, ownProps) {
  return state.nodes[ownProps.id];
}

export function mapDispatchToProps(dispatch) {
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}

export function getSvgCoordsFromClientCoords( clientCoord, elem ) {
  const svg = document.querySelector('svg');
  const target = elem || svg;

  const svgPoint = svg.createSVGPoint();
  svgPoint.x = clientCoord.x;
  svgPoint.y = clientCoord.y;
  // create global space coords
  const globalPoint = svgPoint.matrixTransform(svg.getScreenCTM().inverse());

  // create local space coords for the element being manipulated, returns identity if elem = svg
  const local = globalPoint.matrixTransform(svg.getScreenCTM().inverse().multiply(target.getScreenCTM()));
  return local;
}
