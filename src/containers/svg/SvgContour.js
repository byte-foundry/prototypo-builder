import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { mapCurve } from './../../_utils/pathWalkers';

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
      return mapCurve(pathId, nodes, (start, c1, c2, end, i, length) => {
        let sPoint = '';

        if ( i === 0 ) {
          sPoint += `M ${start.x || 0},${start.y || 0}`;
        }

        if (end) {
          sPoint +=
            `C ${c1.x || 0},${c1.y || 0} ${c2.x || 0},${c2.y || 0} ${end.x || 0} ${end.y || 0}`;
        }

        if ( i === length-1 && nodes[pathId].isClosed ) {
          sPoint += 'Z';
        }

        return sPoint;
      }).join(' ');
    }).join(' ');
  }

  render() {
    const { nodes, id } = this.props;
    const node = nodes[id];
    const classes = classnames({
      contour: true,
      'is-closed': node.isClosed
    });
    return (
      <path d={this.renderChildren()} className={classes} />
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
