import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import SvgExpandedSkeleton from './SvgExpandedSkeleton';

import {
  renderPathData,
  mapDispatchToProps
} from './_utils';

class SvgContour extends Component {
  constructor(props) {
    super(props);
    this.renderPathData = renderPathData.bind(this);
    this.renderChildren = this.renderChildren.bind(this);
  }

  renderChildren() {
    const { nodes, id } = this.props;
    const { childIds } = nodes[id];

    return childIds.map((pathId) => {
<<<<<<< e96a5034c23cc56598e7ed0e0dbe5618daf29a97
      return mapCurve(pathId, nodes, (start, c1, c2, end, i, length) => {
        let sPoint = '';

        if ( i === 0 ) {
          sPoint += `M ${start.x || 0},${start.y || 0}`;
        }

        if (end) {
          sPoint +=
            `C ${c1.x || 0},${c1.y || 0} ${c2.x || 0},${c2.y || 0} ${end.x || 0} ${end.y || 0}`;
        }
=======
      return this.renderPathData(pathId);
    }).join(' ');
  }
>>>>>>> wip expand skeleton

  renderExpandedSkeletons() {
    const { nodes, id } = this.props;
    const { childIds } = nodes[id];

    return (
      childIds
        .filter((pathId) => {
          return nodes[pathId].isSkeleton;
        })
        .map((pathId) => {
          return <SvgExpandedSkeleton key={pathId} id={pathId} parentId={id} />
        })
    );
  }

  render() {
    const { nodes, id } = this.props;
    const node = nodes[id];
    const classes = classnames({
      contour: true,
      'is-closed': node.isClosed
    });
    return (
<<<<<<< e96a5034c23cc56598e7ed0e0dbe5618daf29a97
      <path d={this.renderChildren()} className={classes} />
=======
      <g>
        <path d={this.renderChildren()} />
        {this.renderExpandedSkeletons()}
      </g>
>>>>>>> wip expand skeleton
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
