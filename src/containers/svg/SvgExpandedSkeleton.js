import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { makeGetExpandedSkeleton } from '~/selectors/makeGetExpandedSkeleton';

import {
  renderPathData,
  mapDispatchToProps,
} from './_utils';

class SvgExpandedSkeleton extends Component {
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
}

function makeMapStateToProps() {
  const expanded = { nodes: {} };
  const getExpandedSkeleton = makeGetExpandedSkeleton(expanded);
  const mapStateToProps = (state, props) => {
    return {
      nodes: state.nodes,
      expanded,
      expandedSkeletonId: getExpandedSkeleton( state, props ),
    };
  }
  return mapStateToProps;
}

export default connect(makeMapStateToProps, mapDispatchToProps)(SvgExpandedSkeleton);
