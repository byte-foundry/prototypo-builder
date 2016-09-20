import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import fontModel from '~/_utils/fontModel';
import { getParentGlyphId } from '~/_utils/graph';

import {
  mapDispatchToProps,
} from './_utils';

import NodeProperty from './NodeProperty';

class NodeProperties extends Component {
  render() {
    const { glyphId, id, type } = this.props;
    const { propertyOrder, properties } = fontModel[type];

    return (
      <ul className="text-node__property-list unstyled">
        { propertyOrder.map((propName) => {
          return (
            <li key={propName}>
              <NodeProperty
                glyphId={glyphId}
                nodeId={id}
                name={propName}
                type={properties[propName]} />
            </li>
          );
        }) }
      </ul>
    );
  }
}

NodeProperties.propTypes = {
  actions: PropTypes.object.isRequired,
};

function mapStateToProps(state, ownProps) {
  const glyphId = getParentGlyphId(state.nodes, ownProps.id);

  return {
    ...state.nodes[ownProps.id],
    glyphId,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NodeProperties);
