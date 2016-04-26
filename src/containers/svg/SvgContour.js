import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  mapDispatchToProps
} from './_utils';

class SvgContour extends Component {
  constructor(props) {
    super(props);
    this.renderChildren = this.renderChildren.bind(this);
  }

  renderChildren() {
    const { nodes, id } = this.props;
    const { childIds } = nodes[id];

    return childIds.map((pathId) => {
      const path = nodes[pathId];
      return path.childIds.map((pointId, i) => {
        const point = nodes[pointId];
        let sPoint = '';

        if ( i === 0 ) {
          sPoint += 'M';
        }

        sPoint += ( point.x || '0' ) + ',' + ( point.y || '0' );

        if ( i !== path.childIds.length -1 ) {
          // prepare the next curve
          if ( point.type === 'oncurve' ) {
            sPoint += 'C';
          }
        }
        // close path on last point
        else if ( path.isClosed ) {
          sPoint += 'Z'
        }

        return sPoint;
      }).join(' ');
    }).join(' ');
  }

  render() {
    return (
      <path d={this.renderChildren()} />
    );
  }
}

SvgContour.propTypes = {
  actions: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return { nodes: state.nodes };
}

export default connect(mapStateToProps, mapDispatchToProps)(SvgContour);
