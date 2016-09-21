import React, { Component } from 'react';
import { connect } from 'react-redux';

require('styles/ui/DebugInfos.scss');

class DebugInfos extends Component {

  constructor(props) {
    super(props);
    this.handleDebugClick = this.handleDebugClick.bind(this);
    this.state = {
      isToogled: false
    }
  }

  handleDebugClick(e) {
    e.preventDefault();
    this.setState({isToogled: !this.state.isToogled});
  }

  render() {
    return (
      <div className={`debug-container ${this.state.isToogled ? 'expand' : 'shrink'}`} onClick={this.handleDebugClick}>
        <div className="debug-mask"></div>
        <i className="icon">?</i>
        <ul className="unstyled">
          <li>Debug infos</li>
          <li>UI state: {this.props.ui.uiState}</li>
          <li>Path hovered: {this.props.ui.hovered.path} - {this.props.ui.hovered.parentPath}</li>
          <li>Node hovered: {this.props.ui.hovered.point} - {this.props.ui.hovered.parent}</li>
          <li>Path selected: {this.props.ui.selected.path} - {this.props.ui.selected.parentPath}</li>
          <li>Node selected: {this.props.ui.selected.point} - {this.props.ui.selected.parent}</li>
          <li>Contour selected: {this.props.ui.selected.contour}</li>
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {ui: state.ui};
}

export default connect(mapStateToProps, () => {return {}})(DebugInfos);
