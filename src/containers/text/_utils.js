import React from 'react';
import { bindActionCreators } from 'redux';

import {
  createPath,
  addPath,
  createOncurve,
  addOncurve,
  createOffcurve,
  addOffcurve,
  updateX,
  updateY
} from './../../actions/all';

import fontModel from './../../_utils/fontModel';

import TextNodeProperty from 'components/text/TextNodePropertyComponent';

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
  path: TextPath
}

export function renderTextChild(childId) {
  const { id } = this.props;
  const childType = childId.split('-')[0];
  const TextNode = componentMap[childType];

  return (
    <li key={childId}>
      <TextNode id={childId} parentId={id} />
    </li>
  );
}

export function renderTextProperties() {
  const { id, type } = this.props;
  const { propertyOrder } = fontModel[type];

  return (
    <ul className="text-node__property-list unstyled">
      <li><small><i>{id}</i></small></li>
      { propertyOrder.map((propName) => {
        const value = this.props[propName];
        return (
          <TextNodeProperty key={propName} name={propName} value={value} onInput={this.handleInput} />
        );
      }) }
    </ul>
  );
}

export function mapStateToProps(state, ownProps) {
  return state.nodes[ownProps.id];
}

// The last argument is used to make this function stateless during tests
export function validateChildTypes(props, propName, componentName, prop, model = fontModel) {
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
}

export function mapDispatchToProps(dispatch) {
  const actions = {
    createPath,
    addPath,
    createOncurve,
    addOncurve,
    createOffcurve,
    addOffcurve,
    updateX,
    updateY
  };
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}
