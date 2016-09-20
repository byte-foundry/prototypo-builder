import React, { Component } from 'react';
import { connect } from 'react-redux';

class DebugInfos extends Component {
  render() {
    return (
      <ul className="unstyled">
        <li>Debug infos</li>
        <li>UI state: {this.props.ui.uiState}</li>
        <li>Path hovered: {this.props.ui.hovered.path} - {this.props.ui.hovered.parentPath}</li>
        <li>Node hovered: {this.props.ui.hovered.point} - {this.props.ui.hovered.parent}</li>
        <li>Path selected: {this.props.ui.selected.path} - {this.props.ui.selected.parentPath}</li>
        <li>Node selected: {this.props.ui.selected.point} - {this.props.ui.selected.parent}</li>
        <li>Contour selected: {this.props.ui.selected.contour}</li>
      </ul>
    );
  }
}

function mapStateToProps(state) {
  return {ui: state.ui};
}

export default connect(mapStateToProps, () => {
  return {};
})(DebugInfos);
