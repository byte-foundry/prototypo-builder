import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import fontModel from '~/_utils/fontModel';
import { getParentGlyphId } from '~/_utils/graph';

import {
  getCalculatedParams,
  getCalculatedGlyph
} from '~/containers/_utils';

import {
  mapDispatchToProps
} from './_utils';

import NodeProperty from './NodeProperty';

class NodeProperties extends Component {
  // constructor(props) {
  //   super(props);
  //   this.handleUpdate = this.handleUpdate.bind(this);
  // }
  //
  // handleUpdate(e) {
  //   const { updateProp, updatePropMeta } = this.props.actions;
  //   const { id, type } = this.props;
  //   const { name } = e.target;
  //   const propType = fontModel[type].properties[name];
  //
  //   // This handler is used for both 'input' and 'change event' but we
  //   // want to filter out 'change' events for anything but boolean properties
  //   if ( e.type === 'change' && propType !== 'boolean' ) {
  //     return;
  //   }
  //
  //   if ( propType === 'boolean' ) {
  //     return updateProp(id, name, e.target.checked);
  //   }
  //
  //   if ( /^[\d\.]+$/.test(e.target.value) ) {
  //     updatePropMeta(id, name, { formula: e.target.value, isInvalid: true });
  //     return updateProp(id, name, +e.target.value);
  //   }
  //   return updatePropMeta(id, name, parseFormula(e.target.value));
  // }

  render() {
    const { id, type, glyphId } = this.props;
    const { propertyOrder, properties } = fontModel[type];

    return (
      <ul className="text-node__property-list unstyled">
        { propertyOrder.map((propName) => {
          return (
            <li key={propName}>
              <NodeProperty
                id={id}
                glyphId={glyphId}
                name={propName}
                result={this.props[propName]}
                type={properties[propName]}
              />
            </li>
          );
        }) }
      </ul>
    );
  }
}

NodeProperties.propTypes = {
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  // this computation could be done at the property level as well, but we want
  // to minimize the number of calls to all these methods, and getParentGlyphId
  // especially (which uses a false memoization)
  const glyphId = getParentGlyphId(state.nodes, ownProps.id);

  return {
    ...state.nodes[ownProps.id],
    glyphId,
    ...getCalculatedGlyph(
      state,
      getCalculatedParams(state, null, 'font_initial'),
      glyphId
    )[ownProps.id]
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NodeProperties);
