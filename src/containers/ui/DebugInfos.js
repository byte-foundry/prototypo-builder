import React, { Component } from 'react';
import { connect } from 'react-redux';

class DebugInfos extends Component {
  render() {
    return (
      <p>
        <p>Debug infos</p>
        <p>UI state: {this.props.ui.uiState}</p>
        <p>Path hovered: {this.props.ui.hovered.path} - {this.props.ui.hovered.parentPath}</p>
        <p>Node hovered: {this.props.ui.hovered.point} - {this.props.ui.hovered.parent}</p>
        <p>Path selected: {this.props.ui.selected.path} - {this.props.ui.selected.parentPath}</p>
        <p>Node selected: {this.props.ui.selected.point} - {this.props.ui.selected.parent}</p>
      </p>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps, () => {return {}})(DebugInfos);
