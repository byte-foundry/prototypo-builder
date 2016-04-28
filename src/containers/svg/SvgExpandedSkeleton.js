import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import calculatedNodes from './../../_utils/calculatedNodes';

import { makeGetExpandedSkeleton } from './../../selectors/makeGetExpandedSkeleton';

import {
  renderPathData,
  mapDispatchToProps
} from './_utils';

class SvgExpandedSkeleton extends Component {
  constructor(args) {
    super(args);
    this.renderPathData = renderPathData.bind({ nodes: calculatedNodes });
    this.renderExpandedSkeleton = this.renderExpandedSkeleton.bind(this);
  }

  renderExpandedSkeleton() {
    this.renderPathData( this.props.expandedSkeleton.id );
  }

  render() {
    return (
      <path d={this.renderExpandedSkeleton()} />
    );
  }
}

SvgExpandedSkeleton.propTypes = {
  actions: PropTypes.object.isRequired
}

function makeMapStateToProps() {
  const getExpandedSkeleton = makeGetExpandedSkeleton();
  const mapStateToProps = (state, props) => {
    return {
      nodes: state.nodes,
      expandedSkeleton: getExpandedSkeleton( state, props )
    };
  }
  return mapStateToProps;
}

export default connect(makeMapStateToProps, mapDispatchToProps)(SvgExpandedSkeleton);
