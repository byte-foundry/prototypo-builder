import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';

import Virtual from '~/_utils/Virtual';
import * as Parametric from '~/_utils/Parametric';

import {
  renderPathData,
  mapDispatchToProps,
} from './_utils';

class SvgExpandedSkeleton extends PureComponent {
  constructor(props) {
    super(props);
    this.renderPathData = renderPathData.bind({ props: props.expanded });
    this.renderExpandedSkeleton = this.renderExpandedSkeleton.bind(this);
  }

  renderExpandedSkeleton() {
    return this.renderPathData( this.props.expandedSkeletonId );
  }

  render() {
    return (
      <path d={this.renderExpandedSkeleton()} />
    );
  }
}

SvgExpandedSkeleton.propTypes = {
  actions: PropTypes.object.isRequired,
  // TODO: validate that the first node of expandedPath is a group
  // that has no parent and only on or two children path
};

function makeMapStateToProps() {
  const mapStateToProps = (state, props) => {
    return {
      nodes: state.nodes,
      expandedPath:
        Parametric.expandPath(state.nodes, props.id, Virtual()),
    };
  };

  return mapStateToProps;
}

export default connect(makeMapStateToProps, mapDispatchToProps)(SvgExpandedSkeleton);
