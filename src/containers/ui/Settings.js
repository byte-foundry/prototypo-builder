import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '~/actions';

import ContourOptions from '../ui/ContourOptions';

require('styles/ui/Settings.scss');
require('styles/ui/ContourOptions.scss');

class Settings extends PureComponent {

  constructor(props) {
    super(props);
    this.handleDebugClick = this.handleDebugClick.bind(this);
    this.state = {
      isToogled: false,
    };
  }

  handleDebugClick(e) {
    e.preventDefault();
    this.setState({isToogled: !this.state.isToogled});
  }

  toggleFill(event) {
    this.props.actions.updateProp('contour_initial', 'isClosed', event.target.checked);
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
        <hr/>
        <h4>Fill options</h4>
        <ul className="tg-list">
          <li className="tg-list-item">
            <p>Toggle fill</p>
            <input id="fillMode" type="checkbox" className="tgl tgl-skewed" onChange={this.toggleFill.bind(this)}/>
            <label data-tg-off="off" data-tg-on="on" htmlFor="fillMode" className="tgl-btn fill"></label>
          </li>
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {ui: state.ui};
}
function mapDispatchToProps(dispatch) {
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}

export default connect (mapStateToProps, mapDispatchToProps)(Settings);
