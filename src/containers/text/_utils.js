import React from 'react';
import { bindActionCreators } from 'redux';

import * as actions from '~/actions';
import FontModel from '~/_utils/FontModel';
import * as Graph from '~/_utils/Graph';

import TextContour from './TextContour';
import TextFont from './TextFont';
import TextGlyph from './TextGlyph';
import TextOffcurve from './TextOffcurve';
import TextOncurve from './TextOncurve';
import TextPath from './TextPath';

const componentMap = {
  contour: TextContour,
  font: TextFont,
  glyph: TextGlyph,
  offcurve: TextOffcurve,
  oncurve: TextOncurve,
  path: TextPath,
};

export function renderTextChild(childId) {
  const { id } = this.props;
  const childType = Graph.getNodeType(childId);
  const TextNode = componentMap[childType];

  return (
    <li key={childId}>
      <TextNode id={childId} parentId={id} />
    </li>
  );
}

export function shouldBeUnfolded() {
  const { id, childIds, _isChildrenUnfolded, offcurveIds } = this.props;
  const { nodeOptions } = this.props.ui.selected;

  return _isChildrenUnfolded ? true :
      _isChildrenUnfolded ||
      id === nodeOptions ||
      childIds ? childIds.some(elem => elem === nodeOptions) : false ||
      offcurveIds ? offcurveIds.some(elem => elem === nodeOptions) : false;
}

export function mapStateToProps(state, ownProps) {
  return {ui: state.ui, ...state.nodes[ownProps.id]};
}

// The last argument is used to make this function stateless during tests
export function validateChildTypes(props, propName, componentName, prop, _model) {
  // for some reason _model receives null instead of undefined,
  // so default arguments cannot be used here
  const model = _model || FontModel;
  const componentType = (
    componentName.replace(/^.*?([A-Z][a-z]+?)(Component)?$/, function($0, $1) {
      return $1.toLowerCase();
    })
  );
  const validChildTypes = model[componentType];

  for ( let childId in props[propName] ) {
    const childType = props[propName][childId];

    if ( !(childType in validChildTypes) ) {
      return new Error(
        `Invalid prop '${propName}' supplied to '${componentName}':
         '${childType}' child found. Validation failed.`
      );
    }
  }

  return null;
}

export function mapDispatchToProps(dispatch) {
  const actionMap = { actions: bindActionCreators(actions, dispatch) };

  return actionMap;
}
