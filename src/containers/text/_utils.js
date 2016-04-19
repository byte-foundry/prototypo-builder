import React from 'react';
import { bindActionCreators } from 'redux';
import capitalize from 'lodash/capitalize';

import {
  createPath,
  addPath,
  createOncurve,
  addOncurve,
  createOffcurve,
  addOffcurve
} from './../../actions/all';

import { flatModel } from './../../_utils/fontModels';

import TextContour from './TextContour';
import TextFont from './TextFont';
import TextGlyph from './TextGlyph';
import TextOffcurve from './TextOffcurve';
import TextOncurve from './TextOncurve';
import TextPath from './TextPath';

const textNodes = {
  TextContour,
  TextFont,
  TextGlyph,
  TextOffcurve,
  TextOncurve,
  TextPath
}

export function renderTextChild(childId) {
  const { id } = this.props;
  const childType = childId.split('-')[0];
  const TextNode = textNodes[`Text${capitalize(childType)}`];

  return (
    <li key={childId}>
      <TextNode id={childId} parentId={id} />
    </li>
  );
}

export function mapStateToProps(state, ownProps) {
  return state.nodes[ownProps.id];
}

// The last argument is used to make this function stateless during tests
export function validateChildTypes(props, propName, componentName, prop, model = flatModel) {
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
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`: `' + childType + '` child found.' +
        ' Validation failed.'
      );
    }
  }
}

export function mapDispatchToProps(dispatch) {
  const actions = {
    createPath,
    addPath,
    createOncurve,
    addOncurve,
    createOffcurve,
    addOffcurve
  };
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}
