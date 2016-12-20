import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '~/actions';

require('styles/ui/ContourOptions.scss');

class ControlOptions extends PureComponent {
  setContourMode(event) {
    if (event.target.checked) {
      this.props.actions.setContourMode('simple');
    }
    else {
      this.props.actions.setContourMode('catmull');
    }
  }
  setInterpolatedTangentMode(event) {
    this.props.actions.setInterpolatedTangentsMode(event.target.checked);
  }
  render() {
    return (
      <ul className="tg-list">
        <li className="tg-list-item">
          <p>Contour mode</p>
          <input id="contourMode" type="checkbox" className="tgl tgl-skewed" onChange={this.setContourMode.bind(this)}/>
          <label data-tg-off="catmull" data-tg-on="simple" htmlFor="contourMode" className="tgl-btn mode"></label>
        </li>
        <li className="tg-list-item">
          <p>Show interpolated tangents</p>
          <input id="showInterpolatedTangents" type="checkbox" className="tgl tgl-skewed" onChange={this.setInterpolatedTangentMode.bind(this)}/>
          <label data-tg-off="no" data-tg-on="yes" htmlFor="showInterpolatedTangents" className="tgl-btn tangents"></label>
        </li>
      </ul>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  const actionMap = { actions: bindActionCreators(actions, dispatch) };

  return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlOptions);
