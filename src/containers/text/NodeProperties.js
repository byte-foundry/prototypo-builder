import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';

import * as FontModel from '~/_utils/FontModel';
import * as Graph from '~/_utils/Graph';

import {
  mapDispatchToProps,
} from './_utils';

import NodeProperty from './NodeProperty';

class NodeProperties extends PureComponent {
  render() {
    const { glyphId, id, type } = this.props;
    const { propertyOrder, properties } = FontModel[type];

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
  const glyphId = Graph.getParentGlyphId(state.nodes, ownProps.id);

  return {
    ...state.nodes[ownProps.id],
    glyphId,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NodeProperties);
