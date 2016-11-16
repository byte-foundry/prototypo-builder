import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import ContourOptions from '../ui/ContourOptions';

require('styles/ui/Settings.scss');

class Settings extends PureComponent {

  constructor(props) {
    super(props);
    this.handleDebugClick = this.handleDebugClick.bind(this);
    this.state = {
      isToogled: false,
    }
  }

  handleDebugClick(e) {
    e.preventDefault();
    this.setState({isToogled: !this.state.isToogled});
  }

  render() {
    return (
      <div className={`settings-container ${this.state.isToogled ? 'expand' : 'shrink'}`}>
        <div className="settings-mask" onClick={this.handleDebugClick}></div>
        <div className="icon" onClick={this.handleDebugClick}><img src="/images/cog.svg"/> <span>Settings</span></div>
        <h4>Debug infos</h4>
        <ul className="unstyled debuginfos">
          <li>UI state: {this.props.ui.uiState}</li>
          <li>Path hovered: {this.props.ui.hovered.path} - {this.props.ui.hovered.parentPath}</li>
          <li>Node hovered: {this.props.ui.hovered.point} - {this.props.ui.hovered.parent}</li>
          <li>Path selected: {this.props.ui.selected.path} - {this.props.ui.selected.parentPath}</li>
          <li>Node selected: {this.props.ui.selected.point} - {this.props.ui.selected.parent}</li>
          <li>Contour selected: {this.props.ui.selected.contour}</li>
        </ul>
        <hr/>
        <h4>Contour options</h4>
        <ContourOptions />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {ui: state.ui};
}

export default connect(mapStateToProps, () => {
  return {};
})(Settings);
